"use client";
import ViewControl from "./_components/view-control";
import { Suspense } from "react";
import ApplicationTable from "./_components/application-table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { applicationStatuses } from "@/db/schemas/application";
import { useGetApplications } from "@/hooks/queries/application";
import Loader from "@/components/loader";
import PaginationControl from "@/components/pagination-control";
import { BreakcrumbSetter } from "@/components/breadcrumb";

export default function Page() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  const statusParam = searchParams.get("status") as any;

  const status = statusParam
    ? applicationStatuses.includes(statusParam)
      ? statusParam
      : "pending"
    : "pending";

  const { data, isLoading } = useGetApplications({ page, status });

  return (
    <>
      <BreakcrumbSetter breadcrumbs={[{ label: "Applications" }]} />
      <Suspense>
        <ViewControl />
      </Suspense>
      {isLoading || !data ? (
        <Loader />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <ApplicationTable applications={data.data} />
          </CardContent>
          <CardFooter>
            <PaginationControl page={page} totalPages={data.totalPages} />
          </CardFooter>
        </Card>
      )}
    </>
  );
}
