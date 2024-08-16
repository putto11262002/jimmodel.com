"use client";
import JobForm from "./_components/job-form";
import Container from "@/components/container";
import useSession from "@/hooks/use-session";
import { combine } from "@/lib/utils/auth";
import permissions from "@/config/permission";
import { useGetJob } from "@/hooks/queries/job";
import Loader from "@/components/loader";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const session = useSession(
    combine(permissions.jobs.getJobById, permissions.jobs.updateJobById),
  );

  const { data, isPending } = useGetJob({
    jobId: id,
    enabled: session.status === "authenticated",
  });

  if (isPending || !data) {
    return (
      <Container max="md">
        <Loader />
      </Container>
    );
  }
  return (
    <>
      <JobForm job={data} />
    </>
  );
}
