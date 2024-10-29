import { Job } from "@/lib/domains";
import { JobUpdateInput } from "./inputs";
import { EventMap } from "@/lib/event-hub";

export const JOB_UPDATED = Symbol("JOB_UPDATED");
export const JOB_CREATED = Symbol("JOB_CREATED");
export const JOB_STATUS_UPDATED = Symbol("JOB_STATUS_UPDATED");
export const BOOKING_CREATED = Symbol("BOOKING_CREATED");
export const BOOKING_DELETED = Symbol("BOOKING_DELETED");
export const JOB_MODEL_ADDED = Symbol("JOB_MODEL_ADDED");
export const JOB_MODEL_REMOVED = Symbol("JOB_MODEL_REMOVED");
export const JOB_DELETED = Symbol("JOB_DELETED");

export interface JobEventMap extends EventMap {
  [JOB_CREATED]: { jobId: string };
  [JOB_UPDATED]: { jobId: string; data: JobUpdateInput };
  [JOB_DELETED]: { jobId: string };
  [JOB_STATUS_UPDATED]: { jobId: string; status: Job["status"] };
  [BOOKING_CREATED]: { jobId: string; bookingId: string };
  [BOOKING_DELETED]: { jobId: string; bookingId: string };
  [JOB_MODEL_ADDED]: { jobId: string; modelId: string };
  [JOB_MODEL_REMOVED]: { jobId: string; modelId: string };
}
