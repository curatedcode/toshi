import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import getProductRating from "~/components/Fn/getProductRating";
import getTotals, { fixDecimal } from "~/components/Fn/getTotals";

const cartRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ cookieId: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { cookieId } = input;
      const userId = session?.user.id;

      if (userId) {
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

      if (userId) {
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

  addProduct: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1),
        cookieId: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { productId, quantity, cookieId } = input;
      const userId = session?.user.id;

      if (userId && !cookieId) {
        await prisma.userCart.update({
          where: { userId },
          data: { products: { create: { productId, quantity } } },
        });
        return;
      }

      if (!cookieId) {
        return;
      }

      await prisma.tempCart.update({
        where: { cookieId },
        data: { products: { create: { productId, quantity } } },
      });
      return;
    }),

  removeProduct: publicProcedure
    .input(z.object({ productId: z.string(), cookieId: z.string().nullish() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { productId, cookieId } = input;
      const userId = session?.user.id;

      if (userId) {
        const cart = await prisma.userCart.findUnique({ where: { userId } });
        if (!cart) return;

        await prisma.userCart.update({
          where: { userId },
          data: {
            products: {
              disconnect: {
                productId_userCartId: { productId, userCartId: cart.id },
              },
            },
          },
        });
        return;
      }

      if (!cookieId) {
        return;
      }

      const cart = await prisma.tempCart.findUnique({ where: { cookieId } });
      if (!cart) return;

      await prisma.tempCart.update({
        where: { cookieId },
        data: {
          products: {
            disconnect: {
              productId_tempCartId: { productId, tempCartId: cart.id },
            },
          },
        },
      });
      return;
    }),

  isInCart: publicProcedure
    .input(z.object({ productId: z.string(), cookieId: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { productId, cookieId } = input;
      const userId = session?.user.id;

      if (userId) {
        const cart = await prisma.userCart.findUnique({
          where: { userId },
          select: { products: { where: { productId } } },
        });

        if (!cart) {
          return false;
        }
        if (cart.products.length < 1) {
          return false;
        }

        return true;
      }

      if (!cookieId) {
        return false;
      }

      const cart = await prisma.tempCart.findUnique({
        where: { cookieId },
        select: { products: { where: { productId } } },
      });

      if (!cart) {
        return false;
      }
      if (cart.products.length < 1) {
        return false;
      }

      return true;
    }),

  createTempCart: publicProcedure.mutation(async ({ ctx }) => {
    const { prisma } = ctx;

    const cookie = await prisma.cartCookie.create({ data: {} });

    const cart = await prisma.tempCart.create({
      data: { cookie: { connect: { id: cookie.id } } },
    });

    return { id: cart.cookieId };
  }),

  isCookieValid: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;

      const cookie = await prisma.cartCookie.findUnique({ where: { id } });

      if (!cookie) {
        return { valid: false, id };
      }

      return { valid: true, id };
    }),

  checkout: publicProcedure
    .input(z.object({ cookieId: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { cookieId } = input;
      const userId = session?.user.id;

      if (userId) {
        const cart = await prisma.userCart.findUnique({
          where: { userId },
          select: {
            products: {
              select: {
                quantity: true,
                product: {
                  select: {
                    id: true,
                    name: true,
                    company: { select: { name: true } },
                    price: true,
                    images: { take: 1, select: { url: true } },
                  },
                },
              },
            },
          },
        });

        let totalBeforeTax = 0;
        let totalProducts = 0;

        const productsWithTotal = cart?.products.map((data) => {
          const { product, quantity } = data;
          const total = product.price * quantity;

          totalBeforeTax += total;
          totalProducts += quantity;

          return {
            data: product,
            quantity,
            total,
          };
        });

        return {
          cart: productsWithTotal,
          totalBeforeTax: fixDecimal(totalBeforeTax.toString()),
          totalProducts,
          ...getTotals(totalBeforeTax),
        };
      }

      if (!cookieId) {
        return;
      }

      const cart = await prisma.tempCart.findUnique({
        where: { cookieId },
        select: {
          products: {
            select: {
              quantity: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  company: { select: { name: true } },
                  price: true,
                  images: { take: 1, select: { url: true } },
                },
              },
            },
          },
        },
      });

      let totalBeforeTax = 0;
      let totalProducts = 0;

      const productsWithTotal = cart?.products.map((data) => {
        const { product, quantity } = data;
        const total = product.price * quantity;

        totalBeforeTax += total;
        totalProducts += quantity;

        return {
          data: product,
          quantity,
          total,
        };
      });

      return {
        cart: productsWithTotal,
        totalBeforeTax: fixDecimal(totalBeforeTax.toString()),
        totalProducts,
        ...getTotals(totalBeforeTax),
      };
    }),
});

export default cartRouter;
