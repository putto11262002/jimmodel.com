"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddJobModal from "./add-job-modal";
import { jobStatuses } from "@/db/schemas";
import { upperFirst } from "lodash";
import { JobFilterQuerySchema } from "@/lib/validators/job";
import {
  removeAllParams,
  removeParam,
  setParam,
  URLSearchParamsFromObj,
} from "@/lib/utils/search-param";
import { useRouter, useSearchParams } from "next/navigation";

export default function FilterSection() {
  const searchParams = useSearchParams();
  const { statuses } = JobFilterQuerySchema.parse({
    page: searchParams.get("page"),
    statuses: searchParams.getAll("statuses"),
  });

  const router = useRouter();

  return (
    <div className="flex items-center">
      <div>
        <Select
          onValueChange={(v) => {
            const params = new URLSearchParams(searchParams.toString());
            if (v === "all") {
              removeAllParams("statuses", params);
            } else {
              setParam("statuses", [v], params);
            }
            setParam("page", ["1"], params);
            router.push(`/admin/jobs?${params.toString()}`);
          }}
          value={statuses?.[0] || "all"}
        >
          <SelectTrigger className="min-w-28 h-7">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {jobStatuses.map((status, index) => (
              <SelectItem key={index} value={status}>
                {upperFirst(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <AddJobModal />
      </div>
    </div>
  );
}
