import { COUNTRIES } from "@/db/constants";
import { z } from "zod";

export const ModelExperienceCreateInputSchema = z.object({
  year: z.number(),
  product: z.string().min(1, "Required"),
  country: z.enum(COUNTRIES, { message: "Invalid country" }),
  media: z.string().min(1, "Required"),
  details: z.string().nullable().optional(),
});
