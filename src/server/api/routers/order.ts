import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

const orderRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ createdAfter: z.date().nullish() }))
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { createdAfter } = input;

      const userId = session.user.id;

      const allOrders = await prisma.order.findMany({
        where: { userId, createdAt: { gte: createdAfter ?? undefined } },
        select: {
          id: true,
          createdAt: true,
          deliveredAt: true,
          products: {
            select: {
              priceAtPurchase: true,
              product: {
                select: {
                  id: true,
                  name: true,
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
    .input(z.object({ orderId: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { orderId } = input;

      if (!orderId) return;

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          createdAt: true,
          deliveredAt: true,
          products: {
            select: {
              priceAtPurchase: true,
              product: {
                select: {
                  id: true,
                  name: true,
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
