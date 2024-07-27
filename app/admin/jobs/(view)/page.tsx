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

export default function Page() {
  const { data, isLoading, isSuccess } = useGetJobs();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");

  const page = pageParam ? parseInt(pageParam) || 1 : 1;

  if (isLoading || !isSuccess) {
    return <Loader />;
  }
  return (
    <>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
        </CardHeader>
        <Suspense>
          <CardContent>
            <JobTable jobs={data.data} />
          </CardContent>
          <CardFooter>
            <PaginationControl page={page} totalPages={data.totalPages} />
          </CardFooter>
        </Suspense>
      </Card>
    </>
  );
}
