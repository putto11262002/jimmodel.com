import { UserRole, userRoles, userTable } from "@/db/schemas/users";
import db from "@/db/client";
import { arrayContains, and, count } from "drizzle-orm";
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
import PaginationControl from "./pagination-control";

const getUsers = async ({
  roles,
  page,
  pageSize = 10,
}: {
  roles: UserRole[];
  page: number;
  pageSize?: number;
}) => {
  const whereClause = and(
    ...[...(roles.length > 0 ? [arrayContains(userTable.roles, roles)] : [])],
  );
  const offset = (page - 1) * pageSize;
  const [users, userCounts] = await Promise.all([
    db
      .select()
      .from(userTable)
      .where(whereClause)
      .offset(offset)
      .limit(pageSize),
    db.select({ total: count() }).from(userTable).where(whereClause),
  ]);

  // Validate page input ?
  const total = userCounts?.[0].total ?? 0;
  const totalPages = Math.ceil(total / pageSize);
  return {
    users,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
};

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
          key={`admin/users?${Array.isArray(searchParams.roles) ? searchParams.roles.join(",") : searchParams.roles}`}
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
    pageSize: 10,
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
