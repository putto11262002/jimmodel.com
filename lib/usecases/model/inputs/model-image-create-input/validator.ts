import { MODEL_IMAGE_TYPES } from "@/db/constants";
import { imageValidator } from "@/lib/usecases/common";
import { z } from "zod";

export const NewModelImageCreateInputSchema = z.object({
  file: imageValidator(),
  type: z.enum(MODEL_IMAGE_TYPES),
});

export const ExistingModelImageCreateInputSchema = z.object({
  fileId: z.string(),
  type: z.enum(MODEL_IMAGE_TYPES),
});
