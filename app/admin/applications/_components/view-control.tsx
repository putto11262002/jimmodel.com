"use client";

import LinkTabList from "@/components/link-tab-list";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { applicationStatuses } from "@/db/schemas";
import { removeParam, setParam } from "@/lib/utils/search-param";
import { upperFirst } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";

export default function ViewControl() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const statusParam = searchParams.get("status") as any;
  const status = statusParam
    ? applicationStatuses.includes(statusParam)
      ? statusParam
      : "pending"
    : "pending";

  return (
    <div className="flex items-center gap-4">
      <Select
        value={status}
        onValueChange={(value) => {
          const params = new URLSearchParams(searchParams.toString());
          setParam("status", [value], params);
          router.push(`/admin/applications/?${params.toString()}`);
        }}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue className="" />
        </SelectTrigger>
        <SelectContent>
          {applicationStatuses.map((status, index) => (
            <SelectItem key={index} value={status}>
              {upperFirst(status)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
