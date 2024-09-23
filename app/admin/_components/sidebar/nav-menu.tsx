"use client";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { AuthUser, checkPermission } from "@/lib/auth";
import { LinkMenuItem } from "@/components/shared/types/menu";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function NavMenu({
  navItems,
  user,
}: {
  navItems: LinkMenuItem[];
  user: AuthUser;
}) {
  const pathname = usePathname();
  const active = navItems
    ?.filter((item) => pathname.startsWith(item.href))
    .sort()
    .reverse()[0]?.href;
  return (
    <nav className="">
      <ul className="flex flex-col items-center gap-4">
        {navItems
          .filter((item) => checkPermission(user, item.permissions))
          .map((item) => (
            <li key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-gray-100",
                      item.href === active && "bg-accent text-foreground"
                    )}
                  >
                    {item.icon && (
                      <Button size={"icon"} variant={"ghost"}>
                        {item.icon}
                        <span className="sr-only">{item.label}</span>
                      </Button>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="" side="right">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            </li>
          ))}
      </ul>
    </nav>
  );
}
