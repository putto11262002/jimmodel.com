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
import { getModelProfiles } from "@/lib/usecases/model";

const PAGE_SIZE = 8;

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string[] | string; roles: string[] | string };
}) {
  return (
    <>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Models</CardTitle>
        </CardHeader>
        <Suspense fallback={<TableSkeleton />} key={`admin/models`}>
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

  const { data, totalPages } = await getModelProfiles({
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <>
      <CardContent>
        <UserTable models={data} />
      </CardContent>
      <CardFooter>
        <PaginationControl page={page} totalPages={totalPages} />
      </CardFooter>
    </>
  );
}
