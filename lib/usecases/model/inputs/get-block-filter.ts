import { Model } from "@/lib/domains/types/model";
import { ignoreError } from "@/lib/utils/validator";
import { z } from "zod";

export type GetModelBlocksFilter = {
  page?: number;
  pageSize?: number;
  start?: string;
  end?: string;
  modelIds?: Model["id"][];
  pagination?: boolean;
};

export const GetModelBlocksFilterSchema = z.object({
  page: ignoreError(z.number()),
  pageSize: ignoreError(z.number()),
  pagination: ignoreError(z.boolean()),
  start: ignoreError(z.string().datetime()),
  end: ignoreError(z.string().datetime()),
  modelIds: ignoreError(z.array(z.string())),
});
