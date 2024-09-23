import { BOOKING_TYPES } from "@/db/constants";
import { NewBooking } from "@/db/schemas";
import { z } from "zod";

export type BookingCreateInput = Pick<
  NewBooking,
  "start" | "end" | "type" | "notes"
>;

export const BookingCreateInputSchema: z.ZodSchema<
  BookingCreateInput,
  z.ZodTypeDef,
  any
> = z
  .object({
    start: z.string().datetime(),

    end: z.string().datetime(),
    type: z.enum(BOOKING_TYPES, { message: "Invalid booking type" }),
    notes: z.string().optional(),
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
