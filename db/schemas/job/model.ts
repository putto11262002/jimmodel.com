import { fileMetadataTable, jobTable, modelTable } from "@/db/schemas";
import { relations } from "drizzle-orm";
import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const jobModelTable = pgTable(
  "jobs_models",
  {
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobTable.id, { onDelete: "cascade" }),
    modelId: uuid("model_id").references(() => modelTable.id, {
      onDelete: "set null",
    }),
    modelName: text("model_name").notNull(), // -> modelTable
    modelImageId: uuid("model_image_id").references(
      () => fileMetadataTable.id,
      {
        onDelete: "set null",
      }
    ), // -> modelTable
  },
  (table) => ({
    jobIdIndex: index().on(table.jobId),
    modelIdIndex: index().on(table.modelId),
  })
);

export const jobModelRelation = relations(jobModelTable, ({ one }) => ({
  models: one(modelTable, {
    fields: [jobModelTable.modelId],
    references: [modelTable.id],
  }),
  job: one(jobTable, {
    fields: [jobModelTable.jobId],
    references: [jobTable.id],
  }),
}));

export type JobModel = typeof jobModelTable.$inferSelect;
export type NewJobModel = typeof jobModelTable.$inferInsert;
