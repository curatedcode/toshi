import { z } from "zod";
import getProductRating from "~/components/Fn/getProductRating";
import {
  type ProductSearchResult,
  type ProductWithReviews,
  SearchResultSortBy,
} from "~/customTypes";
import { max_search_results, reviewSchema } from "~/customVariables";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const productRouter = createTRPCRouter({
  getOne: publicProcedure
    .input(z.object({ productId: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { productId } = input;

      if (!productId) return;

      const productData = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          company: { select: { name: true, id: true } },
          images: { select: { url: true } },
          categories: true,
          reviews: {
            select: {
              title: true,
              body: true,
              id: true,
              createdAt: true,
              user: {
                select: { firstName: true, lastName: true, avatarColor: true },
              },
              rating: true,
            },
          },
        },
      });

      if (!productData) return;

      const { reviews } = productData;

      return {
        ...productData,
        reviews: {
          data: reviews,
          rating: getProductRating(reviews),
          _count: reviews.length,
        },
      };
    }),
  search: publicProcedure
    .input(
      z.object({
        limit: z
          .number()
          .min(1)
          .max(max_search_results)
          .default(max_search_results),
        text: z.string(),
        page: z.number().min(1),
        sortBy: SearchResultSortBy,
        filters: z.object({
          price: z.object({
            min: z.number().nullish(),
            max: z.number().nullish(),
          }),
          rating: z.number().nullish(),
          includeOutOfStock: z.boolean(),
        }),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { limit, text, filters, page, sortBy } = input;
      const { rating: ratingFilter, price, includeOutOfStock } = filters;

      const querySearchText = `%${text ?? ""}%`;

      const allProducts: object[] = await prisma.$queryRaw`
        SELECT p.id, AVG(r.rating) AS 'rating'
        FROM Product p
        JOIN Review r ON p.id = r.productId
        WHERE p.name
        LIKE ${querySearchText}
        AND p.price >= ${price.min ?? 0}
        AND p.price <= ${price.max ?? 9_999_999}
        AND p.quantity >= ${includeOutOfStock ? 0 : 1}
        AND rating >= ${ratingFilter ?? 0}
        GROUP BY p.id`;

      let productSearchResult: ProductSearchResult;

      switch (sortBy) {
        case "newest":
          productSearchResult = await prisma.$queryRaw`
            SELECT p.id, p.name, p.price, p.createdAt, AVG(r.rating) AS 'rating', COUNT(r.id) AS 'reviewCount'
            FROM Product p
            JOIN Review r ON p.id = r.productId
            WHERE p.name
            LIKE ${querySearchText}
            AND p.price >= ${price.min ?? 0}
            AND p.price <= ${price.max ?? 9_999_999}
            AND p.quantity >= ${includeOutOfStock ? 0 : 1}
            AND rating >= ${ratingFilter ?? 0}
            GROUP BY p.id
            ORDER BY p.createdAt DESC
            LIMIT ${(page - 1) * limit},${limit}`;
          break;
        case "reviews":
          productSearchResult = await prisma.$queryRaw`
            SELECT p.id, p.name, p.price, p.createdAt, AVG(r.rating) AS 'rating', COUNT(r.id) AS 'reviewCount'
            FROM Product p
            JOIN Review r ON p.id = r.productId
            WHERE p.name
            LIKE ${querySearchText}
            AND p.price >= ${price.min ?? 0}
            AND p.price <= ${price.max ?? 9_999_999}
            AND p.quantity >= ${includeOutOfStock ? 0 : 1}
            AND rating >= ${ratingFilter ?? 0}
            GROUP BY p.id
            ORDER BY rating DESC
            LIMIT ${(page - 1) * limit},${limit}`;
          break;
        case "priceHighToLow":
          productSearchResult = await prisma.$queryRaw`
            SELECT p.id, p.name, p.price, p.createdAt, AVG(r.rating) AS 'rating', COUNT(r.id) AS 'reviewCount'
            FROM Product p
            JOIN Review r ON p.id = r.productId
            WHERE p.name
            LIKE ${querySearchText}
            AND p.price >= ${price.min ?? 0}
            AND p.price <= ${price.max ?? 9_999_999}
            AND p.quantity >= ${includeOutOfStock ? 0 : 1}
            AND rating >= ${ratingFilter ?? 0}
            GROUP BY p.id
            ORDER BY p.price DESC
            LIMIT ${(page - 1) * limit},${limit}`;
          break;
        case "priceLowToHigh":
          productSearchResult = await prisma.$queryRaw`
            SELECT p.id, p.name, p.price, p.createdAt, AVG(r.rating) AS 'rating', COUNT(r.id) AS 'reviewCount'
            FROM Product p
            JOIN Review r ON p.id = r.productId
            WHERE p.name
            LIKE ${querySearchText}
            AND p.price >= ${price.min ?? 0}
            AND p.price <= ${price.max ?? 9_999_999}
            AND p.quantity >= ${includeOutOfStock ? 0 : 1}
            AND rating >= ${ratingFilter ?? 0}
            GROUP BY p.id
            ORDER BY p.price ASC
            LIMIT ${(page - 1) * limit},${limit}`;
          break;
        default:
          productSearchResult = await prisma.$queryRaw`
            SELECT p.id, p.name, p.price, p.createdAt, AVG(r.rating) AS 'rating', COUNT(r.id) AS 'reviewCount'
            FROM Product p
            JOIN Review r ON p.id = r.productId
            WHERE p.name
            LIKE ${querySearchText}
            AND p.price >= ${price.min ?? 0}
            AND p.price <= ${price.max ?? 9_999_999}
            AND p.quantity >= ${includeOutOfStock ? 0 : 1}
            AND rating >= ${ratingFilter ?? 0}
            GROUP BY p.id
            LIMIT ${(page - 1) * limit},${limit}`;
          break;
      }

      const productResultPageCount = Math.ceil(allProducts.length / limit);

      const productsWithRatings: ProductWithReviews = [];

      const categories: string[] = [];

      for (const product of productSearchResult) {
        const { id, name, price, rating, reviewCount, createdAt } = product;

        const firstImage = await prisma.productImage.findFirst({
          where: { productId: id },
        });
        const category = await prisma.category.findFirst({
          where: { products: { some: { id } } },
          select: { name: true },
        });

        if (category?.name && !categories.includes(category.name)) {
          categories.push(category.name);
        }

        const company = await prisma.product.findUnique({
          where: { id },
          select: { company: { select: { id: true, name: true } } },
        });

        productsWithRatings.push({
          id,
          name,
          price,
          createdAt,
          company: company?.company ?? undefined,
          images: firstImage ? [firstImage] : undefined,
          reviews: {
            rating: Math.round(rating * 1e1) / 1e1,
            _count: Number(reviewCount),
          },
        });
      }

      return {
        products: productsWithRatings,
        categories,
        totalPages: productResultPageCount,
        totalResults: allProducts.length,
      };
    }),

  newReleases: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const products = await prisma.product.findMany({
      take: 36,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
        images: {
          take: 1,
        },
        reviews: {
          select: { rating: true },
        },
      },
    });

    const productsWithRatings: ProductWithReviews = [];

    for (const product of products) {
      const { reviews } = product;

      productsWithRatings.push({
        ...product,
        reviews: {
          rating: getProductRating(reviews),
          _count: reviews.length,
        },
      });
    }

    return productsWithRatings;
  }),

  similar: publicProcedure
    .input(z.object({ category: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { category } = input;

      if (!category) return null;

      const similar = await prisma.product.findMany({
        where: { categories: { some: { name: category } } },
        select: {
          id: true,
          name: true,
          price: true,
          images: {
            take: 1,
          },
          reviews: {
            select: { rating: true },
          },
        },
      });

      const similarWithRatings = similar.map((product) => ({
        ...product,
        reviews: {
          rating: getProductRating(product.reviews),
          _count: product.reviews.length,
        },
      }));

      return similarWithRatings;
    }),

  createReview: protectedProcedure
    .input(reviewSchema.extend({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { title, rating, body, productId } = input;
      const userId = session.user.id;

      await prisma.review.create({
        data: { title, rating, body, productId, userId },
      });
      return;
    }),
});

export default productRouter;
