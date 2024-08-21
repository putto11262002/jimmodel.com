"use client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { modelImageTypes } from "@/db/schemas/model-images";
import { setParam } from "@/lib/utils/search-param";
import { upperFirst } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";

const modelImageMenuItems = [
  { label: "All", href: "all" },
  ...modelImageTypes.map((type) => ({
    label: upperFirst(type),
    href: `${type}`,
  })),
];

export default function ImageFilter() {
  const searchParam = useSearchParams();
  const router = useRouter();

  return (
    <Select
      onValueChange={(value) => {
        const params = new URLSearchParams(searchParam.toString());
        setParam("type", [value], params);
        const href = `?${params.toString()}`;
        router.replace(href);
      }}
      defaultValue={searchParam.get("type") || "all"}
    >
      <SelectTrigger className="min-w-32 h-7">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {modelImageMenuItems.map(({ label, href }, index) => (
          <SelectItem key={index} value={href}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
