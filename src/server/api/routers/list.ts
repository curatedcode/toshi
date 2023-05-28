import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import getProductRating from "~/components/Fn/getProductRating";
import { max_list_desc_char, max_list_title_char } from "~/customVariables";

const listRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;
    const userId = session.user.id;

    const allLists = await prisma.list.findMany({
      where: { userId },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        isPrivate: true,
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            images: { take: 1 },
            reviews: { select: { rating: true } },
          },
        },
      },
    });

    const allListsWithRatings = allLists.map((list) => {
      const products = list.products.map((product) => ({
        ...product,
        reviews: {
          rating: getProductRating(product.reviews),
          _count: product.reviews.length,
        },
      }));
      return { ...list, products };
    });

    return allListsWithRatings;
  }),

  getOne: protectedProcedure
    .input(z.object({ listId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { listId } = input;

      const list = await prisma.list.findUnique({
        where: { id: listId },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          isPrivate: true,
          products: {
            select: {
              id: true,
              name: true,
              price: true,
              images: { take: 1 },
              reviews: { select: { rating: true } },
              company: { select: { id: true, name: true } },
            },
          },
        },
      });

      const productsWithRatings = list?.products.map((product) => ({
        ...product,
        reviews: {
          rating: getProductRating(product.reviews),
          _count: product.reviews.length,
        },
      }));

      return { ...list, products: productsWithRatings };
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(max_list_title_char),
        description: z.string().max(max_list_desc_char).nullish(),
        isPrivate: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { name, description, isPrivate } = input;

      const userId = session.user.id;

      const list = await prisma.list.create({
        data: {
          name,
          description,
          isPrivate,
          user: { connect: { id: userId } },
        },
      });

      return { listId: list.id };
    }),

  delete: protectedProcedure
    .input(z.object({ listId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { listId } = input;

      await prisma.list.delete({ where: { id: listId } });

      return;
    }),

  addProduct: protectedProcedure
    .input(
      z.object({
        listId: z.string(),
        productId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { listId, productId } = input;

      await prisma.list.update({
        where: { id: listId },
        data: { products: { connect: { id: productId } } },
      });

      return;
    }),

  removeProduct: protectedProcedure
    .input(
      z.object({
        listId: z.string(),
        productId: z.string().or(z.array(z.string())),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { listId, productId } = input;

      if (typeof productId === "string") {
        await prisma.list.update({
          where: { id: listId },
          data: { products: { disconnect: { id: productId } } },
        });
        return;
      }

      const productIds = productId.map((id) => ({ id }));

      await prisma.list.update({
        where: { id: listId },
        data: { products: { disconnect: productIds } },
      });
    }),

  updateTitle: protectedProcedure
    .input(
      z.object({
        listId: z.string(),
        name: z.string().min(1).max(max_list_title_char),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { listId, name } = input;

      await prisma.list.update({ where: { id: listId }, data: { name } });

      return;
    }),

  updateVisibility: protectedProcedure
    .input(z.object({ listId: z.string(), isPrivate: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { listId, isPrivate } = input;

      await prisma.list.update({ where: { id: listId }, data: { isPrivate } });

      return;
    }),

  getFiveSimple: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;
    const userId = session.user.id;

    const lists = await prisma.list.findMany({
      where: { userId },
      orderBy: { updatedAt: "asc" },
      select: { id: true, name: true },
      take: 5,
    });

    return lists;
  }),

  getAllSimple: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;
    const userId = session.user.id;

    const lists = await prisma.list.findMany({
      where: { userId },
      orderBy: { updatedAt: "asc" },
      select: { id: true, name: true },
    });

    return lists;
  }),
});

export default listRouter;
