"use client";
import { ModeToggler } from "@/components/shared/theme-toggler";
import { NavMenu } from "./nav-menu";
import { AuthUser } from "@/lib/auth";
import { LinkMenuItem } from "@/components/shared/types/menu";
import { UserMenu } from "../user-menu";

export default function Sidebar({
  user,
  navItems,
}: {
  user: AuthUser;
  navItems: LinkMenuItem[];
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-14  border-r bg-background sm:flex flex-col">
      <div className="flex flex-col items-center gap-4 pt-4">
        <NavMenu user={user} navItems={navItems} />
      </div>
      <div className="mt-auto flex flex-col items-center gap-4 pb-4">
        <ModeToggler />
        <UserMenu user={user} />
      </div>
    </aside>
  );
}
