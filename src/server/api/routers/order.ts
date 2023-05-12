import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { OrderPlacedOnEnum } from "~/customTypes";
import dayjs from "dayjs";
import getPreviousDate from "~/components/Fn/getPreviousDate";
import {
  paymentSchema,
  shippingAddressSchema,
  taxPercentage,
} from "~/customVariables";

const orderRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ createdAfter: OrderPlacedOnEnum.nullish() }))
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { createdAfter } = input;

      const userId = session.user.id;

      let filter: Date | undefined;

      switch (createdAfter) {
        case "pastDay":
          filter = dayjs(getPreviousDate(1, "day")).toDate();
          break;
        case "pastWeek":
          filter = dayjs(getPreviousDate(1, "week")).toDate();
          break;
        case "pastMonth":
          filter = dayjs(getPreviousDate(1, "month")).toDate();
          break;
        case "pastThreeMonths":
          filter = dayjs(getPreviousDate(3, "month")).toDate();
          break;
        case "pastSixMonths":
          filter = dayjs(getPreviousDate(6, "month")).toDate();
          break;
        case "pastYear":
          filter = dayjs(getPreviousDate(1, "year")).toDate();
          break;
        default:
          filter = undefined;
          break;
      }

      const allOrders = await prisma.order.findMany({
        where: { userId, createdAt: { gte: filter } },
        select: {
          id: true,
          createdAt: true,
          deliveredAt: true,
          total: true,
          products: {
            select: {
              priceAtPurchase: true,
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
      });

      return allOrders;
    }),

  getOne: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { orderId } = input;

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          createdAt: true,
          deliveredAt: true,
          total: true,
          products: {
            select: {
              priceAtPurchase: true,
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
      });

      return order;
    }),

  create: publicProcedure
    .input(
      z.object({
        shippingAddress: shippingAddressSchema,
        billing: paymentSchema,
        cookieId: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { shippingAddress, billing, cookieId } = input;
      const userId = session?.user.id;

      type OrderProduct = {
        productId: string;
        quantity: number;
        priceAtPurchase: number;
      };

      const date = dayjs(Date());

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
                    price: true,
                  },
                },
              },
            },
          },
        });

        let totalBeforeTax = 0;
        const orderedProducts: OrderProduct[] = [];

        cart?.products.forEach((data) => {
          const { product, quantity } = data;
          const { id, price } = product;

          const total = price * quantity;
          totalBeforeTax += total;

          orderedProducts.push({
            productId: id,
            priceAtPurchase: price,
            quantity,
          });
        });

        const taxToBeCollected =
          Math.round(totalBeforeTax * taxPercentage * 1e2) / 1e2;
        const totalAfterTax = totalBeforeTax + taxToBeCollected;

        const order = await prisma.order.create({
          data: {
            status: "processing",
            total: totalAfterTax,
            products: { createMany: { data: orderedProducts } },
            billingAddress: { create: billing },
            shippingAddress: { create: shippingAddress },
            user: { connect: { id: userId } },
            estimatedDelivery: date.add(2, "day").toDate(),
          },
        });

        return {
          orderId: order.id,
          shippingAddress,
          estimatedDelivery: order.estimatedDelivery,
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
                  price: true,
                },
              },
            },
          },
        },
      });

      let totalBeforeTax = 0;
      const orderedProducts: OrderProduct[] = [];

      cart?.products.forEach((data) => {
        const { product, quantity } = data;
        const { id, price } = product;

        const total = price * quantity;
        totalBeforeTax += total;

        orderedProducts.push({
          productId: id,
          priceAtPurchase: price,
          quantity,
        });
      });

      const taxToBeCollected =
        Math.round(totalBeforeTax * taxPercentage * 1e2) / 1e2;
      const totalAfterTax = totalBeforeTax + taxToBeCollected;

      const order = await prisma.order.create({
        data: {
          status: "processing",
          total: totalAfterTax,
          products: { createMany: { data: orderedProducts } },
          billingAddress: { create: billing },
          shippingAddress: { create: shippingAddress },
          estimatedDelivery: date.add(2, "day").toDate(),
        },
      });

      return {
        orderId: order.id,
        shippingAddress,
        estimatedDelivery: order.estimatedDelivery,
      };
    }),
});

export default orderRouter;
