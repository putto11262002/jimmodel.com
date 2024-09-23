import { NewApplicationImage } from "@/db/schemas";
import { z } from "zod";
import { imageValidator } from "../../common";
import { APPLICATION_IMAGE_TYPES } from "@/db/constants";

export type ApplicationImageCreateInput = {
  file: Blob;
  type: NewApplicationImage["type"];
};

export const ApplicationImageCreateInputSchema = z.object({
  file: imageValidator(),
  type: z.enum(APPLICATION_IMAGE_TYPES),
});
