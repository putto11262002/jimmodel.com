import { Application } from "@/lib/domains/types/application/application";
import { OrderDir, orderDirs } from "../../common/order-dir";
import { z } from "zod";
import { ignoreError } from "@/lib/utils/validator";
import { APPLICATION_STATUS } from "@/db/constants";
export const applicationsOrderFields = ["createdAt", "updatedAt"] as const;
export type ApplicationsOrderField = (typeof applicationsOrderFields)[number];
export type GetApplicationsFilter = {
  page?: number;
  pageSize?: number;
  pagination?: boolean;
  status?: Exclude<
    Application["status"],
    typeof APPLICATION_STATUS.IN_PROGRESS
  >;
  orderDir?: OrderDir;
  orderBy?: ApplicationsOrderField;
};

export const DEFAULT_GET_APPLICATION_FILTER = {
  page: 1,
  pageSize: 10,
  pagination: true,
  orderDir: "desc",
  orderBy: "createdAt",
} as const;

export const GetApplicationsFilterSchema: z.ZodSchema<
  GetApplicationsFilter,
  z.ZodTypeDef,
  any
> = z.object({
  page: ignoreError(z.number().positive()),
  pageSize: ignoreError(z.number().positive()),
  pagination: ignoreError(z.boolean()),
  status: ignoreError(
    z.enum([
      APPLICATION_STATUS.APPROVED,
      APPLICATION_STATUS.REJECTED,
      APPLICATION_STATUS.SUBMITTED,
    ] as const)
  ),
  orderDir: ignoreError(z.enum(orderDirs)),
  orderBy: ignoreError(z.enum(applicationsOrderFields)),
});
