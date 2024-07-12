"use client";
import { UserRole, userRoles } from "@/db/schemas/users";
import UserTable from "./table";
import TableSkeleton from "./table-skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PaginationControl from "@/components/pagination-control";
import { useQuery } from "@tanstack/react-query";
import client from "@/lib/api/client";
import useSession from "@/hooks/use-session";
import { hasPermission } from "@/lib/utils/auth";
import permissions, { UserActions } from "@/config/permission";

const PAGE_SIZE = 8;

const parseUserRole = (role: string): UserRole | null => {
  if (userRoles.includes(role as UserRole)) {
    return role as UserRole;
  }
  return null;
};

export default function Page({
  searchParams,
}: {
  searchParams: { page?: string[] | string; roles: string[] | string };
}) {
  return (
    <>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <PageContent page={searchParams.page} roles={searchParams.roles} />
      </Card>
    </>
  );
}

function PageContent({
  roles,
  page: pageParam,
}: {
  roles: string | string[];
  page?: string | string[];
}) {
  // Use zod to validate and clean search params
  const page = pageParam
    ? parseInt(Array.isArray(pageParam) ? pageParam?.[0] : pageParam, 10) || 1
    : 1;

  const { data, isSuccess } = useQuery({
    queryKey: ["users", { page }],
    queryFn: async () => {
      const res = await client.api.users.$get({
        query: { page: page.toString() },
      });
      return res.json();
    },
  });

  const { data: session, status } = useSession();

  if (!isSuccess || status === "loading") {
    return <TableSkeleton />;
  }

  return (
    <>
      <CardContent>
        <UserTable
          users={data.data}
          allowedActions={{
            [UserActions.updatePasswordById]: hasPermission(
              permissions.users.updatePasswordById,
              session.user.roles,
            ),
            [UserActions.updateRoleById]: hasPermission(
              permissions.users.updateRoleById,
              session.user.roles,
            ),
            [UserActions.addImageById]: hasPermission(
              permissions.users.addImageById,
              session.user.roles,
            ),
          }}
        />
      </CardContent>
      <CardFooter>
        <PaginationControl page={page} totalPages={data.totalPages} />
      </CardFooter>
    </>
  );
}
