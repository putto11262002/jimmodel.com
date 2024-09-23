import { integer, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { fileMetadataTable } from "../file-metadata";
import { showcaseTable } from "./showcase";
import { relations } from "drizzle-orm";

export const showcaseImageTable = pgTable(
  "showcase_images",
  {
    fileId: uuid("file_id")
      .references(() => fileMetadataTable.id)
      .notNull(),
    showcaseId: uuid("showcase_id")
      .references(() => showcaseTable.id)
      .notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.fileId, table.showcaseId] }),
  })
);

export const showcaseImageRelations = relations(
  showcaseImageTable,
  ({ one }) => ({
    showcase: one(showcaseTable, {
      fields: [showcaseImageTable.showcaseId],
      references: [showcaseTable.id],
    }),
    file: one(fileMetadataTable, {
      fields: [showcaseImageTable.fileId],
      references: [fileMetadataTable.id],
    }),
  })
);

export type ShowcaseImage = typeof showcaseImageTable.$inferSelect;
export type NewShowcaseImage = typeof showcaseImageTable.$inferInsert;
