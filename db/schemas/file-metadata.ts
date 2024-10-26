import idTimestamp from "@/db/schemas/base";
import {
  boolean,
  index,
  integer,
  json,
  pgTable,
  text,
} from "drizzle-orm/pg-core";

export const fileMetadataTable = pgTable(
  "file_metadatas",
  {
    ...idTimestamp,
    key: text("key").notNull(),
    mimeType: text("mime_type").notNull(),
    size: integer("size").notNull(),
    metadata: json("metadata"),
    storageId: text("storage_id").notNull(),
    checksum: text("checksum"),
    deleted: boolean("deleted").notNull().default(false),
  },
  (table) => ({
    deletedIndex: index("deleted_index").on(table.deleted),
  })
);

export type FileMetadata = typeof fileMetadataTable.$inferSelect;
export type NewFileMetadata = typeof fileMetadataTable.$inferInsert;
