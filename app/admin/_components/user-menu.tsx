// components/user/UserMenu.tsx
"use client";
import { AuthUser } from "@/lib/auth";
import Avatar from "@/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/actions/auth";
import Link from "next/link";
import routes from "@/config/routes";
import { useMediaQuery } from "@/hooks/use-media-query";

interface UserMenuProps {
  user: AuthUser;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar name={user.name} fileId={user.imageId} size="sm" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        alignOffset={3}
        side={isMobile ? "bottom" : "right"}
      >
        <DropdownMenuLabel>
          <p className="text-foreground text-sm">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <form action={signOutAction}>
          <button className="w-full">
            <DropdownMenuItem>Sign Out</DropdownMenuItem>
          </button>
        </form>
        <Link href={routes.admin.users["[id]"].edit.password({ id: "self" })}>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
