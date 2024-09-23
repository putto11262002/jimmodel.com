import { z } from "zod";

export const ContactMessageCreateInputSchema = z.object({
  name: z.string({ required_error: "Required" }).min(1, "Required"),
  email: z.string({ required_error: "Required" }).email("Invalid email"),
  phone: z.string().optional(),
  message: z
    .string({ required_error: "Required" })
    .min(1, "Required")
    .max(500, "Message is too long"),
});

export type ContactMessageCreateInput = z.infer<
  typeof ContactMessageCreateInputSchema
>;
