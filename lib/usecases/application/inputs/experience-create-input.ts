import { NewApplicationExperience } from "@/db/schemas";
import { COUNTRIES } from "@/db/constants";
import { z } from "zod";

export type ApplicationExperienceCreateInput = Omit<
  NewApplicationExperience,
  "id" | "applicationId"
>;

export const ApplicationExperienceCreateInputSchema = z.object({
  year: z.number({
    required_error: "Required",
    invalid_type_error: "Invalid year",
  }),
  product: z.string().min(1, "Required"),
  country: z.enum(COUNTRIES, {
    invalid_type_error: "Invalid country",
    required_error: "Required",
    message: "Invalid country",
  }),
  media: z.string().min(1, "Required"),
  details: z.string().nullable().optional(),
});
