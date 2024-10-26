import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { fileMetadataTable, userTable } from "@/db/schemas";
import { relations } from "drizzle-orm";
import { bookingTable, jobModelTable } from "@/db/schemas";
import idTimestamp from "@/db/schemas/base";
import { JOB_STATUS, JOB_STATUSES } from "@/db/constants/job-statuses";

export const jobTable = pgTable("jobs", {
  ...idTimestamp,
  // General
  name: text("name").notNull(),
  product: text("product"),

  // Client
  client: text("client"),
  clientAddress: text("client_address"),
  personInCharge: text("person_in_charge"),

  // Production details
  mediaReleased: text("media_released"),
  periodReleased: text("period_released"),
  territoriesReleased: text("territories_released"),
  workingHour: text("working_hour"),
  venueOfShoot: text("venue_of_shoot"),

  // Contract details
  feeAsAgreed: text("fee_as_agreed"),
  overtimePerHour: text("overtime_per_hour"),
  termsOfPayment: text("terms_of_payment"),
  cancellationFee: text("cancellation_fee"),
  contractDetails: text("contract_details"),

  // Metadata
  status: text("status", { enum: JOB_STATUSES })
    .notNull()
    .default(JOB_STATUS.PENDING),
  ownerId: uuid("created_by_id")
    .references(() => userTable.id, { onDelete: "set null" })
    .notNull(),
  private: boolean("private").notNull().default(false),
  ownerName: text("owner_name").notNull(), // -> userTable
  ownerImageId: uuid("owner_image_id").references(() => fileMetadataTable.id, {
    onDelete: "set null",
  }), // -> userTable
});

export const jobTableRelations = relations(jobTable, ({ one, many }) => ({
  owner: one(userTable, {
    fields: [jobTable.ownerId],
    references: [userTable.id],
  }),
  jobModels: many(jobModelTable),
  bookings: many(bookingTable),
}));

export type NewJob = typeof jobTable.$inferInsert;
export type Job = typeof jobTable.$inferSelect;
