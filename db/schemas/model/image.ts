import {
  pgTable,
  uuid,
  primaryKey,
  AnyPgColumn,
  text,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { fileMetadataTable } from "../file-metadata";
import { modelTable } from "./model";
import { MODEL_IMAGE_TYPES } from "@/db/constants/model-image-types";
import { timestamps } from "../base";

export const modelImageTable = pgTable(
  "model_images",
  {
    fileId: uuid("file_id")
      .references(() => fileMetadataTable.id)
      .notNull(),
    modelId: uuid("model_id")
      .references((): AnyPgColumn => modelTable.id, { onDelete: "cascade" })
      .notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    type: text("type", { enum: MODEL_IMAGE_TYPES }).notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.fileId, table.modelId] }),
      modelIdIndex: index().on(table.modelId),
    };
  }
);

export const modelImageRelatios = relations(modelImageTable, ({ one }) => ({
  model: one(modelTable, {
    fields: [modelImageTable.modelId],
    references: [modelTable.id],
  }),
  file: one(fileMetadataTable, {
    fields: [modelImageTable.fileId],
    references: [fileMetadataTable.id],
  }),
}));

export type ModelImage = typeof modelImageTable.$inferSelect;
export type NewModelImage = typeof modelImageTable.$inferInsert;
