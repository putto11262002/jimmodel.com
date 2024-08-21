"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import { useGetJobs } from "@/hooks/queries/job";
import Loader from "@/components/loader";
import JobTable from "./_components/table";
import PaginationControl from "@/components/pagination-control";
import { useSearchParams } from "next/navigation";
import useSession from "@/hooks/use-session";
import permissions from "@/config/permission";
import Container from "@/components/container";
import SearchBar from "./_components/search-bar";
import { useBreadcrumbSetter } from "@/components/breadcrumb";

export default function Page() {
  const session = useSession(permissions.jobs.getJobs);
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");

  const page = pageParam ? parseInt(pageParam) || 1 : 1;

  const { data, isLoading, isSuccess } = useGetJobs({
    page,
    enabled: session.status === "authenticated",
  });

  useBreadcrumbSetter([{ label: "Jobs" }]);

  if (isLoading || !isSuccess) {
    return <Loader />;
  }

  return (
    <Container className="grid gap-4 w-screen">
      <SearchBar />
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
        </CardHeader>
        <Suspense>
          <CardContent>
            <JobTable jobs={data.data} />
          </CardContent>
          <CardFooter>
            {data.totalPages > 1 && (
              <PaginationControl page={page} totalPages={data.totalPages} />
            )}
          </CardFooter>
        </Suspense>
      </Card>
    </Container>
  );
}
