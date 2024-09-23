"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import routes from "@/config/routes";
import { MODEL_IMAGE_TYPE_LABEL_VALUE_PAIRS } from "@/db/constants";
import { useRouter } from "next/navigation";

export default function ModelImageTypeSelect({
  defaultValue,
  modelId,
}: {
  defaultValue?: string;
  modelId: string;
}) {
  const router = useRouter();
  return (
    <Select
      onValueChange={(v) =>
        router.push(
          routes.admin.models["[id]"].images["[type]"]({
            id: modelId,
            type: v as any,
          }),
          { scroll: true }
        )
      }
      defaultValue={defaultValue || "all"}
    >
      <SelectTrigger size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem size="sm" value="all">
          All
        </SelectItem>
        {MODEL_IMAGE_TYPE_LABEL_VALUE_PAIRS.map(({ value, label }, index) => (
          <SelectItem key={index} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
