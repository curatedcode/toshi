import getProductRating from "~/components/Fn/getProductRating";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const categoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const allCategories = await prisma.category.findMany({
      select: { name: true },
      orderBy: { name: "asc" },
    });

    return allCategories;
  }),

  top: publicProcedure.query(() => {
    const top = ["Beauty", "Books", "Tech", "Home", "Shoes", "Toys"];

    return top;
  }),

  recommended: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const recommended = await prisma.product.findMany({
      take: 10,
      skip: 10,
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        reviews: { select: { rating: true } },
      },
    });

    const productsWithRatings = recommended.map((data) => {
      const { id, images, name, price, reviews } = data;
      const firstImage = images[0];

      return {
        id,
        image: firstImage,
        name,
        price,
        reviews: {
          rating: getProductRating(reviews),
          _count: reviews.length,
        },
      };
    });

    return productsWithRatings;
  }),

  bestDeals: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const bestDeals = await prisma.product.findMany({
      take: 10,
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        reviews: { select: { rating: true } },
      },
    });

    const productsWithRatings = bestDeals.map((data) => {
      const { id, images, name, price, reviews } = data;
      const firstImage = images[0];

      return {
        id,
        image: firstImage,
        name,
        price,
        reviews: {
          rating: getProductRating(reviews),
          _count: reviews.length,
        },
      };
    });

    return productsWithRatings;
  }),

  topBrands: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const topBrands = await prisma.company.findMany({
      take: 6,
      where: {
        products: { some: { reviews: { some: { rating: { gte: 4 } } } } },
      },
      select: { name: true },
    });

    return topBrands;
  }),

  sellingOutFast: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const sellingOutFast = await prisma.product.findMany({
      take: 8,
      where: { quantity: { lte: 15 } },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        reviews: { select: { rating: true } },
      },
    });

    const productsWithRatings = sellingOutFast.map((data) => {
      const { id, images, name, price, reviews } = data;
      const firstImage = images[0];

      return {
        id,
        image: firstImage,
        name,
        price,
        reviews: {
          rating: getProductRating(reviews),
          _count: reviews.length,
        },
      };
    });

    return productsWithRatings;
  }),
});

export default categoryRouter;
