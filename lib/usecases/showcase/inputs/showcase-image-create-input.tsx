import { imageValidator } from "@/lib/utils/validator";
import { z } from "zod";

export const ShowcaseImageCreateInputSchema = z.object({
  file: imageValidator(),
});

export type ShowcaseImageCreateInput = z.infer<
  typeof ShowcaseImageCreateInputSchema
>;
