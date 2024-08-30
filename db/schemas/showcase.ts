import { fileInfoTable, modelTable } from "@/db/schemas";
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const showcaseTable = pgTable("showcases", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  coverImageId: uuid("cover_image").references(() => fileInfoTable.id),
  description: text("description"),
  published: boolean("published").notNull().default(false),
  videoLinks: text("video_links").array(),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const showcaseRelations = relations(showcaseTable, ({ one, many }) => ({
  showcasesToModels: many(showcasesToModelsTable),
  images: many(showcaseImageTable),
  coverImage: one(fileInfoTable, {
    fields: [showcaseTable.coverImageId],
    references: [fileInfoTable.id],
  }),
}));

export const showcaseImageTable = pgTable(
  "showcase_images",
  {
    fileId: uuid("file_id")
      .references(() => fileInfoTable.id)
      .notNull(),
    showcaseId: uuid("showcase_id")
      .references(() => showcaseTable.id)
      .notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.fileId, table.showcaseId] }),
  }),
);

export const showcaseImageRelations = relations(
  showcaseImageTable,
  ({ one }) => ({
    showcase: one(showcaseTable, {
      fields: [showcaseImageTable.showcaseId],
      references: [showcaseTable.id],
    }),
    file: one(fileInfoTable, {
      fields: [showcaseImageTable.fileId],
      references: [fileInfoTable.id],
    }),
  }),
);

export const showcasesToModelsTable = pgTable(
  "showcase_to_model",
  {
    showcaseId: uuid("showcase_id")
      .references(() => showcaseTable.id)
      .notNull(),
    modelId: uuid("model_id")
      .references(() => modelTable.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.showcaseId, table.modelId] }),
  }),
);

export const showcasesToModelsRelations = relations(
  showcasesToModelsTable,
  ({ one }) => ({
    model: one(modelTable, {
      fields: [showcasesToModelsTable.modelId],
      references: [modelTable.id],
    }),
    showcase: one(showcaseTable, {
      fields: [showcasesToModelsTable.showcaseId],
      references: [showcaseTable.id],
    }),
  }),
);
