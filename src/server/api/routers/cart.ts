import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import getProductRating from "~/components/Fn/getProductRating";

const cartRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ cookieId: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { cookieId } = input;
      const userId = session?.user.id;

      if (userId && !cookieId) {
        const cartProducts = await prisma.userCart.findUnique({
          where: { userId },
          select: {
            id: true,
            products: {
              select: {
                id: true,
                quantity: true,
                product: {
                  select: {
                    id: true,
                    name: true,
                    images: { take: 1 },
                    price: true,
                    quantity: true,
                    reviews: { select: { rating: true } },
                    company: { select: { id: true, name: true } },
                  },
                },
              },
            },
          },
        });

        const productsWithRatings = cartProducts?.products.map(
          (cartProduct) => {
            const { product } = cartProduct;

            const productWithRating = {
              ...product,
              reviews: {
                rating: getProductRating(product.reviews),
                _count: product.reviews.length,
              },
            };

            return {
              ...cartProduct,
              product: productWithRating,
            };
          }
        );

        return { ...cartProducts, products: productsWithRatings };
      }

      if (!cookieId) {
        return null;
      }

      const cartProducts = await prisma.tempCart.findUnique({
        where: { cookieId },
        select: {
          products: {
            select: {
              id: true,
              quantity: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  images: { take: 1 },
                  price: true,
                  quantity: true,
                  reviews: { select: { rating: true } },
                  company: { select: { id: true, name: true } },
                },
              },
            },
          },
        },
      });

      const productsWithRatings = cartProducts?.products.map((cartProduct) => {
        const { product } = cartProduct;

        const productWithRating = {
          ...product,
          reviews: {
            rating: getProductRating(product.reviews),
            _count: product.reviews.length,
          },
        };

        return {
          ...cartProduct,
          product: productWithRating,
        };
      });

      return { ...cartProducts, products: productsWithRatings };
    }),

  updateQuantity: publicProcedure
    .input(
      z.object({
        cartProductId: z.string(),
        quantity: z.number(),
        cookieId: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { cartProductId, quantity, cookieId } = input;
      const userId = session?.user.id;

      if (userId && !cookieId) {
        await prisma.cartProduct.update({
          where: { id: cartProductId },
          data: { quantity },
        });
        return;
      }

      if (!cookieId) return null;

      await prisma.cartProduct.update({
        where: { id: cartProductId },
        data: { quantity },
      });
      return;
    }),
});

export default cartRouter;
