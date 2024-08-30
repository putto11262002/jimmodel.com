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
import { useSearchParams } from "next/navigation";
import useSession from "@/hooks/use-session";
import permissions from "@/config/permission";
import Container from "@/components/container";
import FilterSection from "./_components/filter-section";
import { useBreadcrumbSetter } from "@/components/breadcrumb";
import { JobFilterQuerySchema } from "@/lib/validators/job";
import Pagination from "@/components/public/pagination";

export default function Page() {
  const session = useSession(permissions.jobs.getJobs);
  const searchParams = useSearchParams();

  const { page, statuses } = JobFilterQuerySchema.parse({
    page: searchParams.get("page"),
    statuses: searchParams.getAll("statuses"),
  });

  const { data, isSuccess } = useGetJobs({
    page,
    statuses,
    enabled: session.status === "authenticated",
  });

  useBreadcrumbSetter([{ label: "Jobs" }]);

  if (!isSuccess) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  return (
    <Container className="grid gap-4 w-screen">
      <FilterSection />
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
        </CardHeader>
        <Suspense>
          <CardContent>
            <JobTable jobs={data.data} />
          </CardContent>
          <CardFooter className="">
            <div className="ml-auto">
              <Pagination size="sm" {...data} path={`/admin/jobs`} />
            </div>
          </CardFooter>
        </Suspense>
      </Card>
    </Container>
  );
}
