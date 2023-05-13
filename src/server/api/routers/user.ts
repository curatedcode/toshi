import { z } from "zod";
import getProductRating from "~/components/Fn/getProductRating";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import bcrypt from "bcryptjs";
import {
  max_city_char,
  max_country_char,
  max_email_char,
  max_firstName_char,
  max_lastName_char,
  max_password_char,
  max_phoneNumber_char,
  max_state_char,
  max_streetAddress_char,
  max_zipCode_char,
  min_password_char,
  min_zipCode_char,
  phone_regex,
  zipCode_regex,
} from "~/customVariables";

const userRouter = createTRPCRouter({
  fullName: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { firstName: true, lastName: true },
    });

    if (!user) return null;

    return {
      name: `${user?.firstName} ${user?.lastName}`,
      firstName: user?.firstName,
      lastName: user?.lastName,
    };
  }),

  getCurrentProfile: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;
    const id = session.user.id;

    const userData = await prisma.user.findUnique({
      where: { id },
      select: {
        email: true,
        image: true,
        firstName: true,
        lastName: true,
        addresses: {
          take: 1,
        },
        lists: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            products: {
              select: {
                id: true,
                name: true,
                price: true,
                images: { take: 1 },
                reviews: { select: { rating: true } },
              },
              take: 5,
            },
          },
          take: 5,
          orderBy: { updatedAt: "desc" },
        },
        orders: {
          select: {
            id: true,
            createdAt: true,
            deliveredAt: true,
            total: true,
            products: {
              select: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    images: { take: 1 },
                    company: { select: { id: true, name: true } },
                  },
                },
                priceAtPurchase: true,
              },
            },
          },
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const listsWithRatings = userData?.lists.map((list) => {
      const { products } = list;

      const productsWithRatings = products.map((product) => ({
        ...product,
        reviews: {
          rating: getProductRating(product.reviews),
          _count: product.reviews.length,
        },
      }));

      return {
        ...list,
        products: productsWithRatings,
      };
    });

    return {
      ...userData,
      lists: listsWithRatings,
    };
  }),

  create: publicProcedure
    .input(
      z.object({
        email: z.string().min(1).max(max_email_char).email(),
        password: z.string().min(min_password_char).max(max_password_char),
        firstName: z.string().min(1).max(max_firstName_char),
        lastName: z.string().min(1).max(max_lastName_char),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { email, password, firstName, lastName } = input;

      const isEmailAlreadyUsed = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (isEmailAlreadyUsed) return null;

      const hash = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: { email, hash, firstName, lastName },
      });

      return {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.firstName,
        image: newUser.image,
        email: newUser.email,
      };
    }),

  settings: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;
    const id = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        phoneNumber: true,
      },
    });

    return {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,

      image: user?.image,
      phoneNumber: user?.phoneNumber ?? undefined,
    };
  }),

  updateName: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1).max(max_firstName_char),
        lastName: z.string().min(1).max(max_lastName_char),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { firstName, lastName } = input;

      await prisma.user.update({
        where: { id: session.user.id },
        data: { firstName, lastName },
      });

      return true;
    }),

  updateEmail: protectedProcedure
    .input(z.object({ email: z.string().min(1).max(max_email_char).email() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { email } = input;

      await prisma.user.update({
        where: { id: session.user.id },
        data: { email },
      });

      return true;
    }),

  updatePhoneNumber: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string().max(max_phoneNumber_char).regex(phone_regex),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { phoneNumber } = input;

      await prisma.user.update({
        where: { id: session.user.id },
        data: { phoneNumber },
      });

      return true;
    }),

  updatePassword: protectedProcedure
    .input(
      z.object({
        password: z.string().min(min_password_char).max(max_password_char),
        currentPassword: z
          .string()
          .min(min_password_char)
          .max(max_password_char),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { password } = input;

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user) return false;
      if (!user.hash) return false;

      const passwordsMatch = await bcrypt.compare(password, user.hash);

      if (!passwordsMatch) return false;

      const hash = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { id: session.user.id },
        data: { hash },
      });

      return true;
    }),

  updateAddress: protectedProcedure
    .input(
      z.object({
        id: z.string().nullish(),
        streetAddress: z.string().min(1).max(max_streetAddress_char),
        city: z.string().min(1).max(max_city_char),
        state: z.string().min(1).max(max_state_char),
        zipCode: z
          .string()
          .min(min_zipCode_char)
          .max(max_zipCode_char)
          .regex(zipCode_regex),
        country: z.string().min(1).max(max_country_char),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { id, streetAddress, city, state, zipCode, country } = input;

      if (!id) {
        await prisma.userAddress.create({
          data: {
            streetAddress,
            city,
            state,
            zipCode,
            country,
            userId: session.user.id,
          },
        });
        return;
      }

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          addresses: {
            update: {
              where: { id },
              data: { streetAddress, city, state, zipCode, country },
            },
          },
        },
      });

      return true;
    }),
});

export default userRouter;
