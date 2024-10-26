import { BOOKING_TYPES, JOB_STATUSES } from "@/db/constants";
import { Booking, Job } from "@/lib/domains/types/job";
import { Model } from "@/lib/domains/types/model";
import { ignoreError } from "@/lib/utils/validator";
import { z } from "zod";

export type GetBookingsFilter = {
  page?: number;
  pageSize?: number;
  start?: Booking["start"];
  end?: Booking["end"];
  jobIds?: Job["id"][];
  type?: Booking["type"];
  modelIds?: Model["id"][];
  statuses?: Job["status"][];
  pagination?: boolean;
};

export const GetBookingsFilterSchema = z.object({
  page: ignoreError(z.number()),
  pageSize: ignoreError(z.number()),
  start: ignoreError(z.string().datetime()),
  end: ignoreError(z.string().datetime()),
  jobIds: ignoreError(z.array(z.string())),
  modelIds: ignoreError(z.array(z.string())),
  statuses: ignoreError(z.array(z.enum(JOB_STATUSES))),
  type: ignoreError(z.enum(BOOKING_TYPES)),
  pagination: ignoreError(z.boolean()),
});
