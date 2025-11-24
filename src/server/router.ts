import { router } from "./trpc";
import { taskRouter } from "./routers/taskRouter";

/**
 * Main app router
 * This file imports all routers and combines them
 */
export const appRouter = router({
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
