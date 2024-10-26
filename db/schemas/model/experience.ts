import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  integer,
  text,
} from "drizzle-orm/pg-core";
import { COUNTRIES } from "@/db/constants/countries";
import { modelTable } from "@/db/schemas/model";

export const modelExperienceTable = pgTable("model_experiences", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  modelId: uuid("application_id"),
  year: integer("year").notNull(),
  media: text("media").notNull(),
  country: text("country", {enum: COUNTRIES}).notNull(),
  product: text("product").notNull(),
  details: text("details"),
});

export const modelExperienceRelations = relations(
  modelExperienceTable,
  ({ one }) => ({
    model: one(modelTable, {
      fields: [modelExperienceTable.modelId],
      references: [modelTable.id],
    }),
  })
);



export type ModelExperience = typeof modelExperienceTable.$inferSelect;
export type NewModelExperience = typeof modelExperienceTable.$inferInsert;