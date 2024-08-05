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
import Container from "@/components/container";
import useSession from "@/hooks/use-session";

export default function Page() {
  const session = useSession();

  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const statusParam = searchParams.get("status") as any;
  const status = statusParam
    ? applicationStatuses.includes(statusParam)
      ? statusParam
      : "pending"
    : "pending";

  const { data, isLoading } = useGetApplications({
    page,
    status,
    enabled: session.status === "authenticated",
  });

  return (
    <Container className="grid gap-4">
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
          {data.totalPages > 1 && (
            <CardFooter>
              <PaginationControl page={page} totalPages={data.totalPages} />
            </CardFooter>
          )}
        </Card>
      )}
    </Container>
  );
}
