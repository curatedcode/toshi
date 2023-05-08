import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { OrderPlacedOnEnum } from "~/customTypes";
import dayjs from "dayjs";
import getPreviousDate from "~/components/Fn/getPreviousDate";

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
});

export default orderRouter;
