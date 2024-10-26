import { MODEL_IMAGE_TYPES } from "@/db/constants";
import { z } from "zod";

export const ModelImageUpdateTypeInputSchema = z.object({
  type: z.enum(MODEL_IMAGE_TYPES),
});

export type ModelImageUpdateTypeInput = z.infer<
  typeof ModelImageUpdateTypeInputSchema
>;
