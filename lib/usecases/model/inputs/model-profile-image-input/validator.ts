import { imageValidator } from "@/lib/usecases/common";
import { z } from "zod";

export const NewModelProfileImageInputSchema = z.object({
  file: imageValidator(),
});
