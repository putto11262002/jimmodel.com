"use client";
import { cn } from "@/lib/utils";
import { upperFirst } from "lodash";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function Menu({
  items,
}: {
  items: { label: string; href: string | ((id: string) => string) }[];
}) {
  const path = usePathname();
  const { id } = useParams<{ id: string }>();
  return (
    <nav
      className="grid gap-4 text-sm text-muted-foreground"
      x-chunk="dashboard-04-chunk-0"
    >
      {items.map(({ href, label }, index) => (
        <Link
          key={index}
          replace
          href={typeof href === "string" ? href : href(id)}
          className={cn(
            path === (typeof href === "string" ? href : href(id)) &&
              "font-semibold text-primary",
          )}
        >
          {upperFirst(label)}
        </Link>
      ))}
    </nav>
  );
}
