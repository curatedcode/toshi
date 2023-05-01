import getProductRating from "~/components/Fn/getProductRating";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
        address: true,
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

      const productsWithRatings = products.map((product) => ({
        ...product,
        reviews: {
          rating: getProductRating(product.reviews),
          _count: product.reviews.length,
        },
      }));

      return {
        ...order,
        products: productsWithRatings,
      };
    });

    return { ...userData, lists: listsWithRatings, orders: ordersWithRatings };
  }),
});

export default userRouter;
