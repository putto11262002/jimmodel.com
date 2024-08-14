"use client";
import { cn } from "@/lib/utils";
import { upperFirst } from "lodash";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FormMenu({
  items,
}: {
  items: { label?: string; id: string }[];
}) {
  const path = usePathname();
  return (
    <nav
      className="grid gap-4 text-sm text-muted-foreground"
      x-chunk="dashboard-04-chunk-0"
    >
      {items.map(({ id, label }, index) => (
        <Link
          key={index}
          replace
          href={`./${id}`}
          className={cn(
            path.split("/").pop() === id && "font-semibold text-primary",
          )}
        >
          {upperFirst(label || id)}
        </Link>
      ))}
    </nav>
  );
}
