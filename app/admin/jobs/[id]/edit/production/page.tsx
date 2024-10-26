import { Card } from "@/components/card";
import JobProductionDetailsForm from "@/components/job/forms/job-production-form";
import { auth } from "@/config";
import permissions from "@/config/permission";
import { getJobOrThrow } from "@/loaders/job";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await auth({ permission: permissions.jobs.updateJobById });
  const job = await getJobOrThrow(id);
  return (
    <Card
      headerBorder
      title="Production Details"
      description="Specifics about the media, time, and location of the job."
    >
      <JobProductionDetailsForm job={job} />
    </Card>
  );
}
