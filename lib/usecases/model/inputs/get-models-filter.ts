import { Model } from "@/lib/domains/types/model";
import { OrderDir } from "@/lib/usecases/types";
import { ignoreError } from "@/lib/utils/validator";
import { z } from "zod";
import { orderDirs } from "../../common/order-dir";
import { BOOKING_STATUSES, MODEL_CATEGORIES } from "@/db/constants";
export const modelOrderFields = ["name", "createdAt", "updatedAt"] as const;

export type BaseGetModelsFilter = {
  page?: number;
  pageSize?: number;
  orderDir?: OrderDir;
  orderBy?: (typeof modelOrderFields)[number];
  q?: string;
  published?: Model["published"];
  category?: Model["category"];
  bookingStatus?: Model["bookingStatus"];
  modelIds?: string[];
};

export type GetModelsFilter =
  | (BaseGetModelsFilter & { pagination?: true; compact?: true })
  | (BaseGetModelsFilter & { pagination: false; compact?: true })
  | (BaseGetModelsFilter & { pagination?: true; compact: false })
  | (BaseGetModelsFilter & { pagination: false; compact: false });

export const GetModelsFilterSchema = z.object({
  page: ignoreError(z.number()),
  pageSize: ignoreError(z.number()),
  orderDir: ignoreError(z.enum(orderDirs)),
  orderBy: ignoreError(z.enum(modelOrderFields)),
  q: ignoreError(z.string()),
  published: ignoreError(z.boolean()),
  category: ignoreError(z.enum(MODEL_CATEGORIES)),
  bookingStatus: ignoreError(z.enum(BOOKING_STATUSES)),
  modelIds: ignoreError(z.array(z.string())),
});
