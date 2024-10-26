import { Card } from "@/components/card";
import JobClientForm from "@/components/job/forms/job-client-form";
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
      title="Client"
      description="Key details about the client and their primary contact"
    >
      <JobClientForm job={job} />
    </Card>
  );
}
