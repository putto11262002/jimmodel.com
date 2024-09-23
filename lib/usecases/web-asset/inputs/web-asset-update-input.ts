import { WEB_ASSET_TAGS } from "@/db/constants";
import { NewWebAsset } from "@/db/schemas";
import { z } from "zod";

export type WebAssetUpdateInput = Partial<Pick<NewWebAsset, "alt" | "tag">>;

export const WebAssetUpdateInputSchema = z.object({
  alt: z.string().min(1, "Required").optional(),
  tag: z.array(z.enum(WEB_ASSET_TAGS)).optional(),
});
