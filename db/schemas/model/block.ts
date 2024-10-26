import idTimestamp from "@/db/schemas/base";
import { modelTable } from "@/db/schemas/model";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const modelBlockTable = pgTable("model_blocks", {
  ...idTimestamp,
  modelId: uuid("model_id")
    .references(() => modelTable.id)
    .notNull(),
  start: timestamp("start", { mode: "string", withTimezone: true }).notNull(),
  end: timestamp("end", { mode: "string", withTimezone: true }).notNull(),
  reason: text("reason").notNull(),
  modelName: text("model_name").notNull(),
});

export const modelBlockRelations = relations(modelBlockTable, ({ one }) => ({
  model: one(modelTable, {
    fields: [modelBlockTable.modelId],
    references: [modelTable.id],
  }),
}));

export type ModelBlock = typeof modelBlockTable.$inferSelect;
export type NewModelBlock = typeof modelBlockTable.$inferInsert;
