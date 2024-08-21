import {
  pgEnum,
  pgTable,
  uuid,
  primaryKey,
  timestamp,
  boolean,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { fileInfoTable } from "./file-metadata";
import { modelTable } from "./models";
import { relations } from "drizzle-orm";

export const modelImageTypes = [
  "book",
  "polaroid",
  "composite",
  "application",
  "other",
] as const;

export type ModelImageType = (typeof modelImageTypes)[number];

export const modelImageTypeEnum = pgEnum("model_image_type", modelImageTypes);

export const modelImageTable = pgTable(
  "model_images",
  {
    fileId: uuid("original_file_id")
      .references(() => fileInfoTable.id, {})
      .notNull(),
    modelId: uuid("model_id")
      .references((): AnyPgColumn => modelTable.id, {})
      .notNull(),
    type: modelImageTypeEnum("image_type"),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.fileId, table.modelId] }),
    };
  },
);

export const modelImageRelatios = relations(modelImageTable, ({ one }) => ({
  model: one(modelTable, {
    fields: [modelImageTable.modelId],
    references: [modelTable.id],
  }),
  file: one(fileInfoTable, {
    fields: [modelImageTable.fileId],
    references: [fileInfoTable.id],
  }),
}));

export type ModelImage = typeof modelImageTable.$inferSelect;
