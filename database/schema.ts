// Drizzle schema will be defined here
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Placeholder table - will be replaced with actual schema
export const example = pgTable("example", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
