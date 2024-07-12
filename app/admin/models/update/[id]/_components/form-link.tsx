"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { upperFirst } from "lodash";
import { cn } from "@/lib/utils";
export default function FormLink({
  formId,
  modelId,
  label,
}: {
  label: string;
  formId: string;
  modelId: string;
}) {
  const path = usePathname();
  return (
    <Link
      href={`/admin/models/update/${modelId}/${formId}`}
      className={cn(
        path.split("/").pop() === formId && "font-semibold text-primary",
      )}
    >
      {upperFirst(label)}
    </Link>
  );
}
