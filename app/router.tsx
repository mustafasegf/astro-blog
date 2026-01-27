import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultViewTransition: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime:
      process.env.NODE_ENV === "development" ? 0 : 1000 * 60 * 60 * 24, // 1 day in prod, 0 in dev
  });

  return router;
}

// Alias for TanStack Start compatibility
export const getRouter = createRouter;
