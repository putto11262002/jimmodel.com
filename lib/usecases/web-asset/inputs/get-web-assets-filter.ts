import { WEB_ASSET_TAGS } from "@/db/constants";
import { WebAsset } from "@/lib/domains/types/web-asset";
import { ignoreError } from "@/lib/utils/validator";
import { z } from "zod";

export type GetWebAssetsFilter = {
  page?: number;
  pageSize?: number;
  pagination?: boolean;
  tag?: WebAsset["tag"][number];
  published?: boolean;
};

export const GetWebAssetsFilterSchema = z.object({
  page: ignoreError(z.number()),
  pageSize: ignoreError(z.number()),
  pagination: ignoreError(z.boolean()),
  tag: ignoreError(z.enum(WEB_ASSET_TAGS)),
  published: ignoreError(z.boolean()),
});
