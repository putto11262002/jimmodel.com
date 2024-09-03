import { z } from "zod";
import { fileValidator } from "./file";
import { webAssetTags } from "../constants/web-asset";
import {
  stringToEnumOrUndefined,
  stringToNumberOrUndefined,
} from "./req-query";

export const WebAssetCreateInputSchema = z.object({
  file: fileValidator({}),
  alt: z.string().optional(),
  tag: z.enum(webAssetTags),
});

export const WebAssetUpdateInputSchema = z.object({
  alt: z.string().optional(),
  tag: z.enum(webAssetTags),
});

export const WebAssetFilterQuerySchema = z.object({
  page: stringToNumberOrUndefined.optional(),
  pageSize: stringToNumberOrUndefined.optional(),
  tag: stringToEnumOrUndefined(webAssetTags).optional(),
});
