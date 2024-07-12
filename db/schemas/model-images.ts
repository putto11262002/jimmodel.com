import {
  pgEnum,
  pgTable,
  uuid,
  primaryKey,
  timestamp,
  boolean,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { fileMetadataTable } from "./file-metadata";
import { modelTable } from "./models";
import { relations } from "drizzle-orm";

export const modelImageTypes = ["book", "polaroid", "composite"] as const;

export type ModelImageType = (typeof modelImageTypes)[number];

export const modelImageTypeEnum = pgEnum("model_image_type", modelImageTypes);

export const modelImageTable = pgTable(
  "model_images",
  {
    fileId: uuid("file_id")
      .references(() => fileMetadataTable.id, {})
      .notNull(),
    modelId: uuid("model_id")
      .references((): AnyPgColumn => modelTable.id, {})
      .notNull(),
    type: modelImageTypeEnum("image_type"),
    isProfile: boolean("is_profile"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
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
}));

export type ModelImage = typeof modelImageTable.$inferSelect;

export type ModelImageCreateInput = typeof modelImageTable.$inferInsert;
