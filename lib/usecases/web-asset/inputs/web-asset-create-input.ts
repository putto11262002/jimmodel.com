import { NewWebAsset } from "@/db/schemas";
import { z } from "zod";
import { imageValidator } from "../../common";
import { WEB_ASSET_TAGS } from "@/db/constants";

export type WebAssetCreateInput = Pick<NewWebAsset, "alt" | "tag"> & {
  file: Blob;
};

export const WebAssetCreateInputSchema = z.object({
  file: imageValidator(),
  alt: z.string().min(1, "Required"),
  tag: z.array(z.enum(WEB_ASSET_TAGS)),
});
