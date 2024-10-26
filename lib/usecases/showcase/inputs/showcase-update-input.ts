import { z } from "zod";

export const ShowcaseUpdateInputSchema = z.object({
  title: z
    .string({ required_error: "Required" })
    .min(1, { message: "Required" })
    .max(100, { message: "Too long" }),
  description: z
    .string({ required_error: "Required" })
    .max(1000, { message: "Too long" })
    .optional()
    .nullable(),
});

export type ShowcaseUpdateInput = z.infer<typeof ShowcaseUpdateInputSchema>;
