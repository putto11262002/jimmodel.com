import { z } from "zod";
import { imageValidator } from "./file";
import {
  stringToEnumArrayOrUndefined,
  stringToNumberOrUndefined,
} from "./req-query";

export const ShowcaseCreateInputSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title is required")
    .max(50, "Title is too long"),
  description: z.string().optional().nullable(),
});

export const ShowcaseUpdateInputSchema = ShowcaseCreateInputSchema.partial();
export const ShowcaseImageCreateInputSchema = z.union([
  z.object({
    file: imageValidator(),
  }),
  z.object({ fileId: z.string() }),
]);

export const ShowcaseFilterQuerySchema = z.object({
  page: stringToNumberOrUndefined.optional(),
  pageSize: stringToNumberOrUndefined.optional(),
});
