"use client";
import MetadataCard from "./_components/metadata-card";
import ActionCard from "./_components/action-card";
import ModelForm from "./_components/model-form";
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
    <Container max="md" className=" grid grid-cols-3 gap-4">
      <div className="col-span-2 grid gap-4">
        <JobForm job={data} />
      </div>
      <div className="flex flex-col gap-4">
        <MetadataCard job={data} />
        <ActionCard job={data} />
        <ModelForm job={data} />
      </div>
    </Container>
  );
}
