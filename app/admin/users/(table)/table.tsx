"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TableHead,
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { UserWithoutSecrets } from "@/lib/types/user";
import UserAvatar from "@/components/user/user-avatar";
import permissions from "@/config/permission";
import { upperFirst } from "lodash";
import Link from "next/link";
import { combine, hasPermission } from "@/lib/utils/auth";
import useSession from "@/hooks/use-session";
import Avatar from "@/components/avatar";
export default function UserTable({ users }: { users: UserWithoutSecrets[] }) {
  const session = useSession();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">
            <span className="sr-only">Image</span>
          </TableHead>
          <TableHead className="hidden md:table-cell">Name</TableHead>
          <TableHead>Username</TableHead>
          <TableHead className="hidden md:table-cell">Email</TableHead>
          <TableHead className="hidden md:table-cell">Roles</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <Avatar name={user.name} fileId={user.image?.id} />
            </TableCell>
            <TableCell className="hidden md:table-cell">{user.name}</TableCell>
            <TableCell className="">{user.username}</TableCell>
            <TableCell className="hidden md:table-cell">{user.email}</TableCell>
            <TableCell className="hidden md:table-cell space-x-2 h-full">
              <div className="space-x-1 inline">
                {user.roles
                  ?.filter((_, i) => i < 2)
                  ?.map((role) => (
                    <Badge key={role} variant="outline">
                      {upperFirst(role)}
                    </Badge>
                  ))}
              </div>
              {user?.roles && user.roles.length > 2 && (
                <p className="inline text-xs text-muted-foreground font-semibold">
                  {user.roles.length - 2} More
                </p>
              )}
            </TableCell>
            <TableCell>
              {session.status === "authenticated" &&
                hasPermission(
                  combine(
                    permissions.users.addImageById,
                    permissions.users.updateRoleById,
                    permissions.users.updatePasswordById,
                  ),
                  session.data.user.roles,
                ) && (
                  <Link href={`/admin/users/${user.id}/update`}>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </Link>
                )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
