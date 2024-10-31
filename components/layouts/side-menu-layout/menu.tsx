"use client";
import { cn } from "@/lib/utils";
import { upperFirst } from "lodash";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LinkMenuItem } from "@/components/shared/types/menu";

export function SideMenu({
  items,
  activeId: activeId,
  onSelect,
}: {
  items: { id: string; label: string }[];
  activeId: string | null;
  onSelect: (index: number) => void;
}) {
  return (
    <nav className="text-sm text-muted-foreground">
      <ul className={cn("grid")}>
        {items.map(({ id, label }, index) => (
          <li
            key={index}
            onClick={() => onSelect(index)}
            className={cn(
              "hover:bg-gray-100 dark:hover:bg-muted/80 px-3 py-2 rounded",
              id == activeId &&
                "font-medium text-primary bg-gray-200/70 dark:bg-muted"
            )}
          >
            {upperFirst(label)}
          </li>
        ))}
      </ul>
    </nav>
  );
}
