import { JobStatus } from "@/db/schemas";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { upperFirst } from "lodash";
export default function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <Badge
      className={cn(
        status === "pending" && "bg-yellow-100 text-yellow-800",
        status === "confirmed" && "bg-green-100 text-green-800",
        status === "cancelled" && "bg-red-100 text-red-800",
      )}
      variant={"outline"}
    >
      {upperFirst(status)}
    </Badge>
  );
}
