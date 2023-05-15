import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { contactFormSchema } from "~/customVariables";

const contactRouter = createTRPCRouter({
  submit: publicProcedure
    .input(contactFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      await prisma.supportMessage.create({ data: input });
      return;
    }),
});

export default contactRouter;
