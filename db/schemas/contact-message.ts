import idTimestamp from "@/db/schemas/base";
import { pgTable, text, boolean } from "drizzle-orm/pg-core";

export const contactMessageTable = pgTable("contact_messages", {
  ...idTimestamp,
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
});

export type ContactMessage = typeof contactMessageTable.$inferSelect;
export type NewContactMessage = typeof contactMessageTable.$inferInsert;
