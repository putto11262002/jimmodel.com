import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { userTable } from "./users";
import { modelTable } from "./models";
import { relations } from "drizzle-orm";

export const jobStatuses = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "archived",
] as const;

export type JobStatus = (typeof jobStatuses)[number];

export const jobStatusEnum = pgEnum("job_status", jobStatuses);

export const jobTable = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  client: varchar("client"),
  product: varchar("product"),
  clientAddress: varchar("client_address"),
  personInCharge: varchar("person_in_charge"),
  mediaReleased: varchar("media_released"),
  periodReleased: varchar("period_released"),
  territoriesReleased: varchar("territories_released"),
  workingHour: varchar("working_hour"),
  venueOfShoot: varchar("venue_of_shoot"),
  feeAsAgreed: varchar("fee_as_agreed"),
  overtimePerHour: varchar("overtime_per_hour"),
  termsOfPayment: varchar("terms_of_payment"),
  cancellationFee: varchar("cancellation_fee"),
  contractDetails: varchar("contract_details"),
  status: jobStatusEnum("status").notNull(),
  ownerId: uuid("created_by_id").notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date().toISOString()),
});

export const jobTableRelations = relations(jobTable, ({ one, many }) => ({
  owner: one(userTable, {
    fields: [jobTable.ownerId],
    references: [userTable.id],
  }),
  jobsToModels: many(jobToModelTable),
}));

export type Job = typeof jobTable.$inferSelect;

export type JobCreateInput = typeof jobTable.$inferInsert;

export type JobUpdateInput = Omit<
  JobCreateInput,
  "createdAt" | "updatedAt" | "ownerId" | "status"
>;

export type JobWithPartialOwner = Omit<Job, "owner"> & {
  owner: { id: string; email: string; name: string };
};

export const bookingTypes = ["fitting", "shoot", "meeting", "other"] as const;

export type BookingType = (typeof bookingTypes)[number];

export const bookingTypeEnum = pgEnum("booking_type", bookingTypes);

export const bookingTable = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobId: uuid("job_id")
    .references(() => jobTable.id)
    .notNull(),
  start: timestamp("start", { mode: "string", withTimezone: true }).notNull(),
  end: timestamp("end", { mode: "string", withTimezone: true }).notNull(),
  type: bookingTypeEnum("type").notNull(),
  notes: varchar("notes"),
  status: jobStatusEnum("status").notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date().toISOString()),
});

export const bookingReltation = relations(bookingTable, ({ one }) => ({
  job: one(jobTable, {
    fields: [bookingTable.jobId],
    references: [jobTable.id],
  }),
}));

export type Booking = typeof bookingTable.$inferSelect;

export type BookingCreateInput = Omit<
  typeof bookingTable.$inferInsert,
  "status"
>;

export const jobToModelTable = pgTable("jobs_models", {
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobTable.id),
  modelId: uuid("model_id")
    .notNull()
    .references(() => modelTable.id),
});

export const jobModelRelation = relations(jobToModelTable, ({ one }) => ({
  models: one(modelTable, {
    fields: [jobToModelTable.modelId],
    references: [modelTable.id],
  }),
  job: one(jobTable, {
    fields: [jobToModelTable.jobId],
    references: [jobTable.id],
  }),
}));
