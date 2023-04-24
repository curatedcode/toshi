import { type ProductImage } from "@prisma/client";
import { z } from "zod";
import getProductRating from "~/components/Fn/getProductRating";
import type {
  ProductSearchResult,
  ProductSearchWithReviews,
} from "~/customTypes";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
          reviews: {
            select: {
              body: true,
              id: true,
              createdAt: true,
              updatedAt: true,
              user: { select: { name: true, image: true } },
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
        page: z.number().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      if (typeof input.text !== "string") return;

      const { prisma } = ctx;
      const { limit, text, filters, page } = input;
      const {
        rating: ratingFilter,
        price,
        category: categoryFilter,
        includeOutOfStock,
      } = filters;

      const querySearchText = `%${text}%`;

      let allProducts: object[];
      let productSearchResult: ProductSearchResult;

      if (categoryFilter) {
        const category = await prisma.category.findUnique({
          where: { name: categoryFilter },
        });

        allProducts = await prisma.$queryRaw`
        SELECT p.id, AVG(r.rating) AS 'rating'
        FROM Product p
        JOIN _CategoryToProduct ctp ON p.id = ctp.B
        JOIN Review r ON p.id = r.productId
        JOIN Category c ON c.id = ${category?.id}
        WHERE p.name
        LIKE ${querySearchText}
        AND p.price >= ${price.min ?? 0}
        AND p.price <= ${price.max ?? 9999999}
        AND p.quantity >= ${includeOutOfStock ? 0 : 1}
        AND rating >= ${ratingFilter ?? 0}
        GROUP BY p.id
        ORDER BY p.id DESC`;

        productSearchResult = await prisma.$queryRaw`
        SELECT p.id, p.name, p.price, AVG(r.rating) AS 'rating', COUNT(r.id) AS 'reviewCount'
        FROM Product p
        JOIN _CategoryToProduct ctp ON p.id = ctp.B
        JOIN Review r ON p.id = r.productId
        JOIN Category c ON c.id = ${category?.id}
        WHERE p.name
        LIKE ${querySearchText}
        AND p.price >= ${price.min ?? 0}
        AND p.price <= ${price.max ?? 9999999}
        AND p.quantity >= ${includeOutOfStock ? 0 : 1}
        AND rating >= ${ratingFilter ?? 0}
        GROUP BY p.id
        ORDER BY p.id DESC
        LIMIT ${(page - 1) * limit},${limit}`;
      } else {
        allProducts = await prisma.$queryRaw`
        SELECT p.id, AVG(r.rating) AS 'rating'
        FROM Product p
        JOIN _CategoryToProduct ctp ON p.id = ctp.B
        JOIN Review r ON p.id = r.productId
        WHERE p.name
        LIKE ${querySearchText}
        AND p.price >= ${price.min ?? 0}
        AND p.price <= ${price.max ?? 9999999}
        AND p.quantity >= ${includeOutOfStock ? 0 : 1}
        AND rating >= ${ratingFilter ?? 0}
        GROUP BY p.id
        ORDER BY p.id DESC`;

        productSearchResult = await prisma.$queryRaw`
        SELECT p.id, p.name, p.price, AVG(r.rating) AS 'rating', COUNT(r.id) AS 'reviewCount'
        FROM Product p
        JOIN _CategoryToProduct ctp ON p.id = ctp.B
        JOIN Review r ON p.id = r.productId
        WHERE p.name
        LIKE ${querySearchText}
        AND p.price >= ${price.min ?? 0}
        AND p.price <= ${price.max ?? 9999999}
        AND p.quantity >= ${includeOutOfStock ? 0 : 1}
        AND rating >= ${ratingFilter ?? 0}
        GROUP BY p.id
        ORDER BY p.id DESC
        LIMIT ${(page - 1) * limit},${limit}`;
      }

      const productResultPageCount = Math.ceil(allProducts.length / limit);

      const productsWithRatings: ProductSearchWithReviews = [];

      const categories: string[] = [];

      for (const product of productSearchResult) {
        const { id, name, price, rating, reviewCount, category } = product;

        let data:
          | [ProductImage | null]
          | [ProductImage | null, [{ id: string }]];
        let categoryName = category;

        if (category) {
          data = await prisma.$transaction([
            prisma.productImage.findFirst({ where: { productId: id } }),
          ]);
        } else {
          data = await prisma.$transaction([
            prisma.productImage.findFirst({ where: { productId: id } }),
            prisma.$queryRaw`
              SELECT A AS 'id'
              FROM _CategoryToProduct
              WHERE B = ${id}`,
          ]);

          const categoryData = await prisma.category.findUnique({
            where: { id: data[1][0].id },
          });
          categoryName = categoryData?.name;
        }

        const firstImage = data[0];

        if (categoryName && !categories.includes(categoryName)) {
          categories.push(categoryName);
        }

        productsWithRatings.push({
          id,
          name,
          price,
          image: firstImage ?? undefined,
          reviews: {
            rating,
            _count: reviewCount,
          },
        });
      }

      return {
        products: productsWithRatings,
        categories,
        totalPages: productResultPageCount,
      };
    }),
});

export default productRouter;
