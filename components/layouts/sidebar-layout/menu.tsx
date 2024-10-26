"use client";
import { cn } from "@/lib/utils";
import { upperFirst } from "lodash";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LinkMenuItem } from "@/components/shared/types/menu";

export function SideMenu({ items }: { items: LinkMenuItem[] }) {
  const path = usePathname();
  return (
    <nav className="text-sm text-muted-foreground">
      <ul className={cn("grid")}>
        {items.map(({ href, label }, index) => (
          <Link key={index} replace href={href}>
            <li
              className={cn(
                "hover:bg-gray-100 dark:hover:bg-muted/80 px-3 py-2 rounded",
                href == path &&
                  "font-medium text-primary bg-gray-200/70 dark:bg-muted"
              )}
            >
              {upperFirst(label)}
            </li>
          </Link>
        ))}
      </ul>
    </nav>
  );
}
