import { Job } from "@/lib/domains";
import { Badge } from "../ui/badge";
import { upperFirst } from "lodash";
import { JOB_STATUS, JOB_STATUS_LABELS } from "@/db/constants";
const jobStatusVariantMap = {
  [JOB_STATUS.PENDING]: "warning",
  [JOB_STATUS.CONFIRMED]: "success",
  [JOB_STATUS.CANCELLED]: "destructive",
} as const;
export default function JobStatusBadge({ status }: { status: Job["status"] }) {
  return (
    <Badge variant={jobStatusVariantMap[status]}>
      {JOB_STATUS_LABELS[status]}
    </Badge>
  );
}
