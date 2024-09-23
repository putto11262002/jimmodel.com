import { Job as _Job, Model as _Model } from "@/db/schemas";
import { JobModel } from "@/lib/domains/types/job/model";

export type Job = _Job & {
  jobModels: JobModel[];
};

export type CompactJob = Pick<
  Job,
  "id" | "name" | "status" | "product" | "jobModels" | "createdAt" | "updatedAt"
>;
