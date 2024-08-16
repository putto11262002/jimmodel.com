"use client";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserMenu from "./user-menu";
import { navMenuItems } from "../../nav-menu";
import useSession from "@/hooks/use-session";
import { Skeleton } from "@/components/ui/skeleton";
import { hasPermission } from "@/lib/utils/auth";
import { UserRole } from "@/db/schemas";

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-14  border-r bg-background sm:flex flex-col">
      <NavMenu navItems={navMenuItems} />
      <UserMenu />
    </aside>
  );
}

function NavMenu<T extends { className?: string | undefined }>({
  navItems,
}: {
  navItems: {
    label: string;
    href: string;
    icon: React.ComponentElement<T, any>;
    permissions: UserRole[];
  }[];
}) {
  const session = useSession();
  if (session.status === "loading") {
    return (
      <nav>
        <ul className="flex flex-col items-center gap-6 sm:py-5">
          {new Array(5).fill(0, 0, 5).map((_, index) => (
            <li key={index}>
              <Skeleton className="rounded-md w-6 h-6" />
            </li>
          ))}
        </ul>
      </nav>
    );
  }
  return (
    <nav className="">
      <ul className="flex flex-col items-center gap-6 sm:py-5">
        {navItems
          .filter((item) =>
            hasPermission(item.permissions, session.data.user.roles),
          )
          .map((item) => (
            <li key={item.label}>
              <NavMenuItem
                label={item.label}
                href={item.href}
                icon={item.icon}
              />
            </li>
          ))}
      </ul>
    </nav>
  );
}

function NavMenuItem<T extends { className?: string | undefined }>({
  label,
  href,
  icon,
}: {
  label: string;
  href: string;
  icon: React.ComponentElement<T, any>;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className="flex items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-gray-100"
        >
          {icon}
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent className="" side="right">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
