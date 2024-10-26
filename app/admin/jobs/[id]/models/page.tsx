import { Card } from "@/components/card";
import JobModelAddDialog from "@/components/job/dialogs/job-model-add-dialog";
import JobModelEditableTable from "@/components/job/tables/job-model-editable-table";
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
    <div className="grid gap-4">
      <div className="flex justify-end">
        <JobModelAddDialog job={job} />
      </div>
      <JobModelEditableTable jobId={id} models={job.jobModels} />
    </div>
  );
}
