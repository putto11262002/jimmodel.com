import { COUNTRIES } from "@/db/constants/countries";
import { relations } from "drizzle-orm";
import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { applicationTable } from "./application";
import { id } from "../base";

export const applicationExperienceTable = pgTable("application_experiences", {
  id: id,
  applicationId: uuid("application_id")
    .references(() => applicationTable.id, { onDelete: "cascade" })
    .notNull(),
  year: integer("year").notNull(),
  media: text("media").notNull(),
  country: text("country", { enum: COUNTRIES }).notNull(),
  product: text("product").notNull(),
  details: text("details"),
});

export const applicationExperienceRelations = relations(
  applicationExperienceTable,
  ({ one }) => ({
    application: one(applicationTable, {
      fields: [applicationExperienceTable.applicationId],
      references: [applicationTable.id],
    }),
  })
);

export type ApplicationExperience =
  typeof applicationExperienceTable.$inferSelect;
export type NewApplicationExperience =
  typeof applicationExperienceTable.$inferInsert;
