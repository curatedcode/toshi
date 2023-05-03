import { z } from "zod";
import getProductRating from "~/components/Fn/getProductRating";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import bcrypt from "bcryptjs";

const userRouter = createTRPCRouter({
  getCurrentProfile: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;
    const id = session.user.id;

    const userData = await prisma.user.findUnique({
      where: { id },
      select: {
        email: true,
        image: true,
        name: true,
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
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { email, password } = input;

      const isEmailAlreadyUsed = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (isEmailAlreadyUsed) return null;

      const hash = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({ data: { email, hash } });

      return {
        id: newUser.id,
        name: newUser.name,
        image: newUser.image,
        email: newUser.email,
      };
    }),

  signIn: publicProcedure
    .input(
      z.object({
        email: z.string().min(1).max(64).email(),
        password: z.string().min(1).max(1024),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { email, password } = input;

      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, hash: true, image: true },
      });

      if (!user) return null;
      if (!user.hash) return null;

      const isCorrectPassword = await bcrypt.compare(password, user.hash);

      if (!isCorrectPassword) return null;

      return true;
    }),
});

export default userRouter;
