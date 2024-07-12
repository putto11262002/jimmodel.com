import { bookingTable, jobStatuses, jobTable } from "@/db/schemas";
import { UserWithoutSecrets } from "./user";
import { Model } from "./model";

export type Job = typeof jobTable.$inferSelect & {
  owner: Pick<UserWithoutSecrets, "id" | "email" | "name" | "image">;
  models: Pick<Model, "id" | "name" | "profileImage">[];
};

export type JobStatus = (typeof jobStatuses)[number];

export type JobCreateInput = Omit<typeof jobTable.$inferInsert, "status"> & {
  status: Extract<JobStatus, "pending" | "confirmed">;
};

export type JobUpdateInput = Omit<
  JobCreateInput,
  "createdAt" | "updatedAt" | "ownerId" | "status"
>;

export type Booking = typeof bookingTable.$inferSelect;

export type BookingWithJob = Booking & {
  job: Job;
};
