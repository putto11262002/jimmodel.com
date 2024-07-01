import { UserRole, userRoles } from "@/db/schemas/users";
import UserTable from "./table";
import { Suspense } from "react";
import TableSkeleton from "./table-skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PaginationControl from "@/components/pagination-control";
import { getUsers } from "@/lib/usecases/user";
import { searchParamsToString } from "@/lib/utils/search-param";

const PAGE_SIZE = 8;

const parseUserRole = (role: string): UserRole | null => {
  if (userRoles.includes(role as UserRole)) {
    return role as UserRole;
  }
  return null;
};

export default async function Page({
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
        <Suspense
          fallback={<TableSkeleton />}
          key={`admin/users?${searchParamsToString(searchParams)}`}
        >
          <PageContent page={searchParams.page} roles={searchParams.roles} />
        </Suspense>
      </Card>
    </>
  );
}

async function PageContent({
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

  const { users, totalPages } = await getUsers({
    roles: (Array.isArray(roles) ? roles : [roles])
      .map(parseUserRole)
      .filter((role) => role !== null),
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <>
      <CardContent>
        <UserTable users={users} />
      </CardContent>
      <CardFooter>
        <PaginationControl page={page} totalPages={totalPages} />
      </CardFooter>
    </>
  );
}
