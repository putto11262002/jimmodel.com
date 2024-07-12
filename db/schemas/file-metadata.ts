import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const fileMetadataTable = pgTable("file_metadata", {
  id: uuid("id").primaryKey(),
  path: varchar("path").notNull(),
  mimeType: varchar("mime_type").notNull(),
});

export type FileMetadata = typeof fileMetadataTable.$inferSelect;
