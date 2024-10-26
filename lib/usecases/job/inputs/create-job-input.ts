import { JOB_STATUS } from "@/db/constants";
import { NewJob } from "@/db/schemas";
import { z } from "zod";

export type JobCreateInput = Omit<
  NewJob,
  | "id"
  | "ownerId"
  | "createdAt"
  | "updatedAt"
  | "status"
  | "modelIds"
  | "private"
  | "ownerName"
> & {
  status: Extract<
    NewJob["status"],
    typeof JOB_STATUS.CONFIRMED | typeof JOB_STATUS.PENDING
  >;
};

export const JobCreateInputSchema: z.ZodSchema<JobCreateInput> = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  product: z.string().optional(),
  client: z.string().optional(),
  clientAddress: z.string().optional(),
  personInCharge: z.string().optional(),
  mediaReleased: z.string().optional(),
  periodReleased: z.string().optional(),
  territoriesReleased: z.string().optional(),
  workingHour: z.string().optional(),
  venueOfShoot: z.string().optional(),
  feeAsAgreed: z.string().optional(),
  overtimePerHour: z.string().optional(),
  termsOfPayment: z.string().optional(),
  cancellationFee: z.string().optional(),
  contractDetails: z.string().optional(),
  status: z.enum([JOB_STATUS.PENDING, JOB_STATUS.CONFIRMED]),
});
