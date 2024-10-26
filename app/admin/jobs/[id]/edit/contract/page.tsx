import { Card } from "@/components/card";
import JobContractForm from "@/components/job/forms/job-contract-form";
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
  console.log("job", job);
  return (
    <Card
      headerBorder
      title="Contract"
      description="Agreed terms, payments, and contractual obligations."
    >
      <JobContractForm job={job} />
    </Card>
  );
}
