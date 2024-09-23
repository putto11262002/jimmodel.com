import { Badge } from "../ui/badge";
import { Application } from "@/lib/domains";
import {
  APPLICATION_STATUS,
  APPLICATION_STATUS_LABELS,
} from "@/db/constants";
const statusMap = {
  [APPLICATION_STATUS.SUBMITTED]: "warning",
  [APPLICATION_STATUS.APPROVED]: "success",
  [APPLICATION_STATUS.REJECTED]: "destructive",
  [APPLICATION_STATUS.IN_PROGRESS]: "default",
} as const;
export default function ApplicationStatusBadge({
  status,
}: {
  status: Application["status"];
}) {
  return (
    <Badge variant={statusMap[status]}>
      {APPLICATION_STATUS_LABELS[status]}
    </Badge>
  );
}
