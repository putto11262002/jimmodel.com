"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TableHead,
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { User } from "@/db/schemas/users";
import { MoreHorizontal } from "lucide-react";
import { UserAction, useUserActions } from "./actions-context";
import { UserWithoutSecrets } from "@/lib/types/user";
import UserAvatar from "@/components/user/user-avatar";
import { UserActions } from "@/config/permission";
import { upperFirst } from "lodash";
export default function UserTable({
  users,
  allowedActions,
}: {
  users: UserWithoutSecrets[];
  allowedActions: {
    [UserActions.updatePasswordById]: boolean;
    [UserActions.updateRoleById]: boolean;
    [UserActions.addImageById]: boolean;
  };
}) {
  const { invoke } = useUserActions();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden sm:table-cell">
            <span className="sr-only">Image</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
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
              <UserAvatar user={user} />
            </TableCell>
            <TableCell className="hidden sm:table-cell">{user.name}</TableCell>
            <TableCell className="font-medium">{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="space-x-2 h-full">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  {allowedActions[UserActions.updatePasswordById] && (
                    <DropdownMenuItem
                      onClick={() =>
                        invoke({
                          action: UserAction.ResetPassword,
                          target: user,
                          title: "Reset Password",
                        })
                      }
                    >
                      Reset Password
                    </DropdownMenuItem>
                  )}
                  {allowedActions[UserActions.addImageById] && (
                    <DropdownMenuItem
                      onClick={() => {
                        invoke({
                          action: UserAction.UploadImage,
                          target: user,
                          title: "Upload Image",
                        });
                      }}
                    >
                      Upload Image
                    </DropdownMenuItem>
                  )}
                  {allowedActions[UserActions.addImageById] && (
                    <DropdownMenuItem
                      onClick={() => {
                        invoke({
                          action: UserAction.UpdateRole,
                          target: user,
                          title: "Update User Role",
                        });
                      }}
                    >
                      Update role
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
