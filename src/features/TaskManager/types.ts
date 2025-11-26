import { tasks } from "@/database/schema";

/**
 * Task type inferred from the Drizzle schema
 */
export type Task = typeof tasks.$inferSelect;

/**
 * Auxiliary types (exported from the store for consistency)"
 */
export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

