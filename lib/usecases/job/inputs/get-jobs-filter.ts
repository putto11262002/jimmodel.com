import { JOB_STATUSES } from "@/db/constants";
import { Job } from "@/lib/domains/types/job";
import { ignoreError } from "@/lib/utils/validator";
import { z } from "zod";
import { OrderDir, orderDirs } from "../../common/order-dir";

export const jobOrderFields = [
  "createdAt",
  "updatedAt",
  "name",
  "status",
] as const;

export type GetJobsFilter = {
  page?: number;
  pageSize?: number;
  pagination?: boolean;
  status?: Job["status"];
  jobIds?: string[];
  modelIds?: string[];
  ownerIds?: string[];
  q?: string;
  orderBy?: (typeof jobOrderFields)[number];
  orderDir?: OrderDir;
};

export const GetJobsFilterSchema = z.object({
  page: ignoreError(z.number()),
  pageSize: ignoreError(z.number()),
  pagination: ignoreError(z.boolean()),
  status: ignoreError(z.enum(JOB_STATUSES)),
  jobIds: ignoreError(z.array(z.string())),
  modelsIds: ignoreError(z.array(z.string())),
  ownerIds: ignoreError(z.array(z.string())),
  q: ignoreError(z.string()),
  orderBy: ignoreError(z.enum(jobOrderFields)),
  orderDir: ignoreError(z.enum(orderDirs)),
});
