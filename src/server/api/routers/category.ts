import type { CategoryFeedQueryData } from "~/customTypes";
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

    const products: CategoryFeedQueryData = await prisma.$queryRaw`
      SELECT
        p.id,
        AVG(r.rating) AS rating,
        COUNT(r.rating) AS rating_count,
        p."name",
        p.price,
        array_agg(pi2.url) AS image_urls
      FROM
        public."Product" p
      JOIN public."Review" r 
      ON
        r."productId" = p.id
      JOIN public."ProductImage" pi2
      ON
        pi2."productId" = p.id
      WHERE
        rating >= 3.5
        AND MOD(p.quantity,
        2) = 0
      GROUP BY
        p.id
      LIMIT 15;
      `;

    const productsFormatted = products.map((data) => {
      const { id, name, price, rating, rating_count, image_urls } = data;

      const imagesFormatted = image_urls.map((url) => ({ url }));
      const reviewsFormatted = { rating, _count: Number(rating_count) };

      return {
        id,
        name,
        price,
        reviews: reviewsFormatted,
        images: imagesFormatted,
      };
    });

    return productsFormatted;
  }),

  bestDeals: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const products: CategoryFeedQueryData = await prisma.$queryRaw`
      SELECT
        p.id,
        AVG(r.rating) AS rating,
        COUNT(r.rating) AS rating_count,
        p."name",
        p.price,
        array_agg(pi2.url) AS image_urls
      FROM
        public."Product" p
      JOIN public."Review" r 
      ON
        r."productId" = p.id
      JOIN public."ProductImage" pi2
      ON
        pi2."productId" = p.id
      WHERE
        rating >= 3.5
        AND MOD(p.quantity,
        2) = 0
      GROUP BY
        p.id
      OFFSET 15
      LIMIT 15;
      `;

    const productsFormatted = products.map((data) => {
      const { id, name, price, rating, rating_count, image_urls } = data;

      const imagesFormatted = image_urls.map((url) => ({ url }));
      const reviewsFormatted = { rating, _count: Number(rating_count) };

      return {
        id,
        name,
        price,
        reviews: reviewsFormatted,
        images: imagesFormatted,
      };
    });

    return productsFormatted;
  }),

  topBrands: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const topBrands = await prisma.company.findMany({
      take: 6,
      where: {
        products: { some: { reviews: { some: { rating: { gte: 4 } } } } },
      },
      select: { id: true, name: true, logoURL: true },
    });

    return topBrands;
  }),

  sellingOutFast: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const products: CategoryFeedQueryData = await prisma.$queryRaw`
      SELECT
        p.id,
        AVG(r.rating) AS rating,
        COUNT(r.rating) AS rating_count,
        p."name",
        p.price,
        array_agg(pi2.url) AS image_urls
      FROM
        public."Product" p
      JOIN public."Review" r 
      ON
        r."productId" = p.id
      JOIN public."ProductImage" pi2
      ON
        pi2."productId" = p.id
      WHERE
        rating >= 3.5
        AND MOD(p.quantity,
        2) = 0
      GROUP BY
        p.id
      OFFSET 30
      LIMIT 15;
      `;

    const productsFormatted = products.map((data) => {
      const { id, name, price, rating, rating_count, image_urls } = data;

      const imagesFormatted = image_urls.map((url) => ({ url }));
      const reviewsFormatted = { rating, _count: Number(rating_count) };

      return {
        id,
        name,
        price,
        reviews: reviewsFormatted,
        images: imagesFormatted,
      };
    });

    return productsFormatted;
  }),
});

export default categoryRouter;
