import { pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";
import { showcaseTable } from "./showcase";
import { modelTable } from "../model";
import { relations } from "drizzle-orm";

export const showcaseModelTable = pgTable(
  "showcase_models",
  {
    showcaseId: uuid("showcase_id")
      .references(() => showcaseTable.id, { onDelete: "cascade" })
      .notNull(),
    modelId: uuid("model_id")
      .references(() => modelTable.id, { onDelete: "set null" })
      .notNull(),
    modelName: text("model_name").notNull(),
    modelProfileImage: uuid("model_profile_image"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.showcaseId, table.modelId] }),
  })
);

export const showcasesToModelsRelations = relations(
  showcaseModelTable,
  ({ one }) => ({
    model: one(modelTable, {
      fields: [showcaseModelTable.modelId],
      references: [modelTable.id],
    }),
    showcase: one(showcaseTable, {
      fields: [showcaseModelTable.showcaseId],
      references: [showcaseTable.id],
    }),
  })
);

export type ShowcaseModel = typeof showcaseModelTable.$inferSelect;
export type NewShowcaseModel = typeof showcaseModelTable.$inferInsert;
