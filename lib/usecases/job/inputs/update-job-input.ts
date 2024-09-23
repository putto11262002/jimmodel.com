import { NewJob } from "@/db/schemas";
import { z } from "zod";

export type JobUpdateInput = Partial<
  Omit<NewJob, "id" | "ownerId" | "createdAt" | "updatedAt" | "status">
>;

export const JobUpdateInputSchema: z.ZodSchema<JobUpdateInput> = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .optional(),
  product: z.string().nullable().optional(),
  client: z.string().nullable().optional(),
  clientAddress: z.string().nullable().optional(),
  personInCharge: z.string().nullable().optional(),
  mediaReleased: z.string().nullable().optional(),
  periodReleased: z.string().nullable().optional(),
  territoriesReleased: z.string().nullable().optional(),
  workingHour: z.string().nullable().optional(),
  venueOfShoot: z.string().nullable().optional(),
  feeAsAgreed: z.string().nullable().optional(),
  overtimePerHour: z.string().nullable().optional(),
  termsOfPayment: z.string().nullable().optional(),
  cancellationFee: z.string().nullable().optional(),
  contractDetails: z.string().nullable().optional(),
});
