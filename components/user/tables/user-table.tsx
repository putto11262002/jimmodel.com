import DataTable from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";
import Avatar from "@/components/avatar";
import { USER_ROLE_LABELS } from "@/db/constants";
import routes from "@/config/routes";
import { UserWithoutSecrets } from "@/lib/domains";

export default function UserTable({ users }: { users: UserWithoutSecrets[] }) {
  return (
    <DataTable
      border
      rounded
      shadow
      columns={
        [
          {
            key: "avatar",
            hideHeader: true,
          },
          {
            key: "name",
            header: "Name",
          },
          {
            key: "username",
            header: "Username",
          },
          {
            key: "roles",
            header: "Roles",
          },
          {
            key: "action",
            hideHeader: true,
            align: "right",
          },
        ] as const
      }
      data={users.map((user) => ({
        avatar: <Avatar size="sm" fileId={user.imageId} name={user.name} />,
        name: user.name,
        username: user.username,
        roles: (
          <div className="flex items-center gap-1">
            {user.roles.map((role, index) => (
              <Badge variant={"outline"} key={index}>
                {USER_ROLE_LABELS[role]}
              </Badge>
            ))}
          </div>
        ),
        action: (
          <Link
            href={routes.admin.users["[id]"].edit.password({ id: user.id })}
          >
            <Button size={"icon"} variant={"ghost"}>
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        ),
      }))}
    />
  );
}
