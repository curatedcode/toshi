import { createTRPCRouter } from "~/server/api/trpc";
import category from "./routers/category";
import product from "./routers/product";
import user from "./routers/user";
import order from "./routers/order";
import list from "./routers/list";
import cart from "./routers/cart";
import contact from "./routers/contact";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  category,
  product,
  user,
  order,
  list,
  cart,
  contact,
});

// export type definition of API
export type AppRouter = typeof appRouter;
