import { z } from "zod";
import getProductRating from "~/components/Fn/getProductRating";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import bcrypt from "bcryptjs";

const userRouter = createTRPCRouter({
  fullName: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { firstName: true, lastName: true },
    });

    if (!user) return null;

    return {
      name: `${user?.firstName} ${user?.lastName}`,
      firstName: user?.firstName,
      lastName: user?.lastName,
    };
  }),

  getCurrentProfile: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;
    const id = session.user.id;

    const userData = await prisma.user.findUnique({
      where: { id },
      select: {
        email: true,
        image: true,
        firstName: true,
        lastName: true,
        addresses: {
          take: 1,
        },
        lists: {
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
              },
              take: 5,
            },
          },
          take: 5,
          orderBy: { updatedAt: "desc" },
        },
        orders: {
          select: {
            id: true,
            createdAt: true,
            deliveredAt: true,
            total: true,
            products: {
              select: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    images: { take: 1 },
                    company: { select: { id: true, name: true } },
                  },
                },
              },
            },
          },
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const listsWithRatings = userData?.lists.map((list) => {
      const { products } = list;

      const productsWithRatings = products.map((product) => ({
        ...product,
        reviews: {
          rating: getProductRating(product.reviews),
          _count: product.reviews.length,
        },
      }));

      return {
        ...list,
        products: productsWithRatings,
      };
    });

    const orders = userData?.orders.map((order) => {
      const products = order.products.map((product) => product.product);

      return { ...order, products };
    });

    return {
      ...userData,
      lists: listsWithRatings,
      orders,
    };
  }),

  create: publicProcedure
    .input(
      z.object({
        email: z.string().min(1).max(64).email(),
        password: z.string().min(8).max(1024),
        firstName: z.string().min(1).max(25),
        lastName: z.string().min(1).max(25),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { email, password, firstName, lastName } = input;

      const isEmailAlreadyUsed = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (isEmailAlreadyUsed) return null;

      const hash = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: { email, hash, firstName, lastName },
      });

      return {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.firstName,
        image: newUser.image,
        email: newUser.email,
      };
    }),

  settings: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;
    const id = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        addresses: { where: { isPrimary: { equals: true } } },
        image: true,
        phoneNumber: true,
      },
    });

    return {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      address: user?.addresses[0],
      image: user?.image,
      phoneNumber: user?.phoneNumber ?? undefined,
    };
  }),

  updateName: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1).max(25),
        lastName: z.string().min(1).max(25),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { firstName, lastName } = input;

      await prisma.user.update({
        where: { id: session.user.id },
        data: { firstName, lastName },
      });

      return true;
    }),

  updateEmail: protectedProcedure
    .input(z.object({ email: z.string().min(1).max(64).email() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { email } = input;

      await prisma.user.update({
        where: { id: session.user.id },
        data: { email },
      });

      return true;
    }),

  updatePhoneNumber: protectedProcedure
    .input(
      z.object({
        phoneNumber: z
          .string()
          .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { phoneNumber } = input;

      await prisma.user.update({
        where: { id: session.user.id },
        data: { phoneNumber },
      });

      return true;
    }),

  updatePassword: protectedProcedure
    .input(
      z.object({
        password: z.string().min(8).max(1024),
        currentPassword: z.string().min(8).max(1024),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { password } = input;

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user) return false;
      if (!user.hash) return false;

      const passwordsMatch = await bcrypt.compare(password, user.hash);

      if (!passwordsMatch) return false;

      const hash = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { id: session.user.id },
        data: { hash },
      });

      return true;
    }),

  updateAddress: protectedProcedure
    .input(
      z.object({
        id: z.string().nullish(),
        streetAddress: z.string().min(1).max(100),
        city: z.string().min(1).max(100),
        state: z.string().min(1).max(100),
        zipCode: z
          .string()
          .min(5)
          .regex(/(^\d{5}(?:[\s]?[-\s][\s]?\d{4})?$)/),
        country: z.string().min(1).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { id, streetAddress, city, state, zipCode, country } = input;

      if (!id) {
        await prisma.address.create({
          data: {
            streetAddress,
            city,
            state,
            zipCode,
            country,
            userId: session.user.id,
            addressee: session.user.name,
          },
        });
        return;
      }

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          addresses: {
            update: {
              where: { id },
              data: { streetAddress, city, state, zipCode, country },
            },
          },
        },
      });

      return true;
    }),
});

export default userRouter;
