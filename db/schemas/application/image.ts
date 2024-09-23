import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { fileMetadataTable } from "../file-metadata";
import { APPLICATION_IMAGE_TYPES } from "@/db/constants/application-image-types";
import { applicationTable } from "./application";
import { timestamps } from "../base";
import { relations } from "drizzle-orm";

export const applicationImageTable = pgTable("application_images", {
  fileId: uuid("file_id")
    .references(() => fileMetadataTable.id)
    .notNull(),
  type: text("type", { enum: APPLICATION_IMAGE_TYPES }).notNull(),
  applicationId: uuid("application_id")
    .references(() => applicationTable.id)
    .notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  ...timestamps,
});

export const applicationImageRelations = relations(
  applicationImageTable,
  ({ one }) => ({
    application: one(applicationTable, {
      fields: [applicationImageTable.applicationId],
      references: [applicationTable.id],
    }),
  })
);

export type ApplicationImage = typeof applicationImageTable.$inferSelect;
export type NewApplicationImage = typeof applicationImageTable.$inferInsert;
