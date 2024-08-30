import { z } from "zod";
import {
  stringToBoolean,
  stringToDate,
  stringToNumberOrUndefined,
} from "./req-query";

export const ContactMessageCreateInputSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .min(1, "First name is required"),
  lastName: z
    .string({ required_error: "Last name is required" })
    .min(1, "Last name is required"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email"),
  phone: z.string().optional(),
  message: z
    .string({ required_error: "Message is required" })
    .min(1, "Message is required"),
});

export const ContactMessageFilterQuerySchema = z.object({
  page: stringToNumberOrUndefined.optional(),
  pageSize: stringToNumberOrUndefined.optional(),
  read: stringToBoolean.optional(),
  from: stringToDate.optional(),
  to: stringToDate.optional(),
});
