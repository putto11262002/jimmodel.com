import { NewShowcase } from "@/db/schemas";
import { z } from "zod";

export type ShowcaseCreateInput = Omit<
  NewShowcase,
  "id" | "createdAt" | "updatedAt" | "coverImageId" | "videos" | "published"
>;

export const ShowcaseCreateInputSchema = z.object({
  title: z
    .string({ required_error: "Required" })
    .min(1, { message: "Required" })
    .max(100, { message: "Too long" }),
  description: z
    .string({ required_error: "Required" })
    .max(1000, { message: "Too long" })
    .optional(),
});
