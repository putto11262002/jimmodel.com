"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function LinkTabList({
  links,
}: {
  links: { label: string; href: string; active?: boolean }[];
}) {
  const path = usePathname();
  return (
    <ul className="bg-muted inline-flex items-center gap-2 rounded p-1 font-medium">
      {links.map(({ label, href, active }, index) => (
        <Link key={index} href={href}>
          <li
            className={cn(
              "cursor-pointer text-muted-foreground bg-muted py-1 px-4 rounded text-sm",
              (active || path === href) && "bg-background text-foreground",
            )}
          >
            {label}
          </li>
        </Link>
      ))}
    </ul>
  );
}
