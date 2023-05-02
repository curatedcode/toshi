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
          take: 5,
        },
        orders: {
          select: {
            id: true,
            createdAt: true,
            products: {
              select: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    images: { take: 1 },
                    reviews: { select: { rating: true } },
                  },
                },
              },
            },
          },
          take: 5,
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

    const ordersWithRatings = userData?.orders.map((order) => {
      const { products } = order;

      const productsWithRatings = products.map((product) => {
        const { product: realProduct } = product;

        return {
          ...realProduct,
          reviews: {
            rating: getProductRating(realProduct.reviews),
            _count: realProduct.reviews.length,
          },
        };
      });

      return {
        ...order,
        products: productsWithRatings,
      };
    });

    return { ...userData, lists: listsWithRatings, orders: ordersWithRatings };
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
});

export default userRouter;
