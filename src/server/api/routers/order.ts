import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { OrderPlacedOnEnum } from "~/customTypes";
import dayjs from "dayjs";
import getPreviousDate from "~/components/Fn/getPreviousDate";
import { shippingAddressSchema } from "~/customVariables";
import getTotals from "~/components/Fn/getTotals";
import { createId } from "@paralleldrive/cuid2";
import getRelativeTime from "~/components/Fn/getRelativeDate";

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
          status: true,
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
          status: true,
          shippingAddress: {
            select: {
              streetAddress: true,
              city: true,
              state: true,
              zipCode: true,
              country: true,
            },
          },
          billingAddress: {
            select: {
              streetAddress: true,
              city: true,
              state: true,
              zipCode: true,
              country: true,
            },
          },
          total: true,
          subtotal: true,
          shippingTotal: true,
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
        billing: shippingAddressSchema,
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

        const order = await prisma.order.create({
          data: {
            status: "processing",
            total: parseFloat(getTotals(totalBeforeTax).totalAfterTax),
            subtotal: totalBeforeTax,
            shippingTotal: 0,
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

      const order = await prisma.order.create({
        data: {
          status: "processing",
          total: parseFloat(getTotals(totalBeforeTax).totalAfterTax),
          subtotal: totalBeforeTax,
          shippingTotal: 0,
          products: { createMany: { data: orderedProducts } },
          billingAddress: { create: billing },
          shippingAddress: { create: shippingAddress },
          estimatedDelivery: date.add(2, "day").toDate(),
          user: {
            create: {
              avatarColor: "blue",
              email: createId(),
              firstName: shippingAddress.firstName,
              lastName: shippingAddress.lastName,
            },
          },
        },
      });

      return {
        orderId: order.id,
        shippingAddress,
        estimatedDelivery: order.estimatedDelivery,
      };
    }),

  getFiveSimple: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;
    const userId = session.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, createdAt: true },
      take: 5,
    });

    const ordersTimeFormatted = orders.map((order) => ({
      id: order.id,
      createdAt: getRelativeTime(order.createdAt),
    }));

    return ordersTimeFormatted;
  }),
});

export default orderRouter;
