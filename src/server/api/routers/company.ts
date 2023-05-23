import { z } from "zod";
import getProductRating from "~/components/Fn/getProductRating";
import { max_company_product_results } from "~/customVariables";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const companyRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ companyId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { companyId } = input;

      const company = await prisma.company.findUnique({
        where: { id: companyId },
        select: {
          name: true,
          location: true,
          about: true,
          logoURL: true,
        },
      });

      return company;
    }),

  products: publicProcedure
    .input(
      z.object({
        companyId: z.string(),
        limit: z
          .number()
          .min(1)
          .max(max_company_product_results)
          .default(max_company_product_results),
        page: z.number().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { companyId, limit, page } = input;

      const skip = page === 1 ? 0 : limit * (page - 1);

      const allCompanyProducts = await prisma.company.findUnique({
        where: { id: companyId },
        select: {
          products: {
            select: {
              id: true,
            },
          },
        },
      });

      const company = await prisma.company.findUnique({
        where: { id: companyId },
        select: {
          products: {
            select: {
              id: true,
              images: { take: 1 },
              name: true,
              price: true,
              reviews: { select: { rating: true } },
            },
            skip,
            take: limit,
          },
        },
      });

      const productsWithRatings = company?.products.map((product) => ({
        ...product,
        reviews: {
          rating: getProductRating(product.reviews),
          _count: product.reviews.length,
        },
      }));

      const allProductsLength = allCompanyProducts
        ? allCompanyProducts.products.length
        : 0;

      return {
        products: productsWithRatings,
        totalPages: Math.ceil(allProductsLength / limit),
      };
    }),
});

export default companyRouter;
