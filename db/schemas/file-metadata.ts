import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const fileInfoTable = pgTable("files", {
  id: uuid("id").primaryKey(),
  path: varchar("path").notNull(),
  mimeType: varchar("mime_type").notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export type FileMetadata = typeof fileInfoTable.$inferSelect;
