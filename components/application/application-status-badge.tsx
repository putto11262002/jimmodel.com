import { ApplicationStatus } from "@/lib/types/application";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { upperFirst } from "lodash";

export default function ApplicationStatusBadge({
  status,
}: {
  status: ApplicationStatus;
}) {
  return (
    <Badge
      className={cn(
        status === "pending" && "bg-yellow-100 text-yellow-800",
        status === "approved" && "bg-green-100 text-green-800",
        status === "rejected" && "bg-red-100 text-red-800",
      )}
      variant={"outline"}
    >
      {upperFirst(status)}
    </Badge>
  );
}
