import { z } from "zod";
import getProductRating from "~/components/Fn/getProductRating";
import type {
  ProductSearchResult,
  ProductSearchWithReviews,
} from "~/customTypes";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const productRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(16).default(16),
        text: z.string().min(1).nullish(),
        filters: z.object({
          price: z.object({
            min: z.number().nullish(),
            max: z.number().nullish(),
          }),
          rating: z.number().nullish(),
          category: z.string().nullish(),
          includeOutOfStock: z.boolean(),
        }),
        categoriesOnPage: z.array(z.string()),
        totalPages: z.number().nullish(),
        page: z.number().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      if (typeof input.text !== "string") return;

      const { prisma } = ctx;
      const { limit, text, filters, categoriesOnPage, page, totalPages } =
        input;
      const {
        rating: ratingFilter,
        price,
        category: categoryFilter,
        includeOutOfStock,
      } = filters;

      const queryLike = `%${text}%`;
      // get count of total results for jumping pagination
      const allProducts: object[] = await prisma.$queryRaw`
        SELECT p.id
        FROM Product p
        JOIN _CategoryToProduct ctp
        ON p.id = ctp.B
        WHERE p.name
        LIKE ${queryLike}
        AND p.price >= ${price.min ?? 0}
        AND p.price <= ${price.max ?? 9999999}
        AND p.quantity >= ${includeOutOfStock ? 0 : 1}
        ORDER BY p.id DESC`;

      const productResultPageCount = Math.ceil(allProducts.length / limit);

      const productSearchResult: ProductSearchResult = await prisma.$queryRaw`
        SELECT p.id, p.name, p.price, ctp.A AS "categoryId"
        FROM Product p
        JOIN _CategoryToProduct ctp
        ON p.id = ctp.B
        WHERE p.name
        LIKE ${queryLike}
        AND p.price >= ${price.min ?? 0}
        AND p.price <= ${price.max ?? 9999999}
        AND p.quantity >= ${includeOutOfStock ? 0 : 1}
        ORDER BY p.id DESC
        LIMIT ${(page - 1) * limit},${limit}`;

      const productsWithRatings: ProductSearchWithReviews = [];

      const categoryIds: string[] = [];
      const categories: string[] = [];

      for (const product of productSearchResult) {
        const { id, name, price, categoryId: rawCategoryId } = product;
        const productId = id;
        let categoryId = "";

        if (!categoryIds.includes(rawCategoryId) && categoryIds.length < 5) {
          categoryId = rawCategoryId;
        }

        const data = await prisma.$transaction([
          prisma.review.findMany({ where: { productId } }),
          prisma.productImage.findFirst({ where: { productId } }),
          prisma.category.findUnique({ where: { id: categoryId } }),
        ]);

        const reviews = data[0];
        const firstImage = data[1];
        const category = data[2];

        const rating = getProductRating(reviews);

        // skip over current product if any of these filters match
        if (ratingFilter) {
          if (!rating) continue;
          if (rating < ratingFilter) continue;
        }
        if (category && categoryFilter) {
          if (category.name !== categoryFilter) {
            continue;
          }
        }
        if (category && !categories.includes(category.name)) {
          if (categoriesOnPage.includes(category.name)) continue;
          categories.push(category.name);
        }

        productsWithRatings.push({
          id,
          name,
          price,
          image: firstImage ?? undefined,
          reviews: {
            rating,
            _count: reviews.length,
          },
        });
      }

      return {
        products: productsWithRatings,
        categories,
        totalPages: productResultPageCount ?? totalPages,
      };
    }),
});

export default productRouter;
