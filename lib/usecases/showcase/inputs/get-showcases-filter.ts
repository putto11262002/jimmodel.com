import { z } from "zod";
import { OrderDir, orderDirs } from "../../common/order-dir";
import { ignoreError } from "@/lib/utils/validator";

export const showcaseOrderFields = ["title", "createdAt", "updatedAt"] as const;

export type ShowcaseOrderField = (typeof showcaseOrderFields)[number];

export type GetShowcasesFilter = {
  published?: boolean;
  page?: number;
  pageSize?: number;
  pagination?: boolean;
  orderBy?: ShowcaseOrderField;
  orderDir?: OrderDir;
};

export const GetShowcasesFilterSchema = z.object({
  page: ignoreError(z.number().positive()),
  pageSize: ignoreError(z.number().positive()),
  published: ignoreError(z.boolean()),
  pagination: ignoreError(z.boolean()),
  orderBy: ignoreError(z.enum(showcaseOrderFields)),
  orderDir: ignoreError(z.enum(orderDirs)),
});

export const DEFAULT_GET_SHOWCASES_FILTER = {
  page: 1,
  pageSize: 10,
  pagination: true,
  orderBy: "createdAt",
  orderDir: "desc",
} as const;
