import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { jobTable, userTable } from "@/db/schemas";
import idTimestamp from "@/db/schemas/base";
import { JOB_STATUSES, BOOKING_TYPES } from "@/db/constants";

export const bookingTable = pgTable("bookings", {
  ...idTimestamp,
  id: uuid("id").defaultRandom().primaryKey(),
  jobId: uuid("job_id")
    .references(() => jobTable.id, { onDelete: "cascade" })
    .notNull(),
  start: timestamp("start", { mode: "string", withTimezone: true }).notNull(),
  end: timestamp("end", { mode: "string", withTimezone: true }).notNull(),
  type: text("type", { enum: BOOKING_TYPES }).notNull(),
  notes: varchar("notes"),
  status: text("status", { enum: JOB_STATUSES }).notNull(), // -> jobTable
  jobName: text("job_name").notNull(), // -> jobTable
  ownerId: uuid("owner_id").references(() => userTable.id),
});

export const bookingReltation = relations(bookingTable, ({ one }) => ({
  job: one(jobTable, {
    fields: [bookingTable.jobId],
    references: [jobTable.id],
  }),
  owner: one(userTable, {
    fields: [bookingTable.ownerId],
    references: [userTable.id],
  }),
}));

export type Booking = typeof bookingTable.$inferSelect;
export type NewBooking = typeof bookingTable.$inferInsert;
