import JobActionCard from "@/components/job/cards/job-action-card";
import { auth } from "@/config";
import permissions from "@/config/permission";
import { getJobOrThrow } from "@/loaders/job";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth({ permission: permissions.jobs.getJobById });
  const job = await getJobOrThrow(id);

  return <JobActionCard user={session.user} job={job} />;
}
