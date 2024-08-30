import { bookingTypes, jobStatuses } from "@/db/schemas/jobs";
import { z } from "zod";
import {
  stringArray,
  stringToBoolean,
  stringToEnumArrayOrUndefined,
  stringToNumberOrUndefined,
} from "./req-query";

export const JobCreateInputSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required"),
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
  ownerId: z.string(),
  status: z.enum(["pending", "confirmed"]),
});

export const JobUpdateInputSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required"),
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

export const BookingCreateInputSchema = z
  .object({
    jobId: z.string(),
    start: z
      .string()
      .datetime()
      .or(z.date().transform((d) => new Date(d).toISOString())),
    end: z
      .string()
      .datetime()
      .or(z.date().transform((d) => new Date(d).toISOString())),
    type: z.enum(bookingTypes),
    notes: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (new Date(data.start).getTime > new Date(data.end).getTime) {
      ctx.addIssue({
        code: "invalid_date",
        message: "Start date cannot be after end date",
        path: ["start"],
      });
      return z.NEVER;
    }
    return data;
  });

export const JobFilterQuerySchema = z.object({
  page: stringToNumberOrUndefined.optional(),
  pageSize: stringToNumberOrUndefined.optional(),
  statuses: stringToEnumArrayOrUndefined(jobStatuses).optional(),
  jobIds: stringArray.optional(),
  pagination: stringToBoolean.optional(),
});
