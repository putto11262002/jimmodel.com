import { Card } from "@/components/card";
import JobGeneralForm from "@/components/job/forms/job-general-form";
import { auth } from "@/config";
import permissions from "@/config/permission";
import { getJobOrThrow } from "@/loaders/job";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await auth({ permission: permissions.jobs.getJobById });
  const job = await getJobOrThrow(id);
  return (
    <Card
      headerBorder
      title="General"
      description="General information about the job"
    >
      <JobGeneralForm job={job} />
    </Card>
  );
}
