"use client";
import { CardHeader, Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useArchive as useArchiveJob,
  useCancelJob,
  useConfrirmJob as useConfirmJob,
  useGetJob,
} from "@/hooks/queries/job";
import { Job } from "@/lib/types/job";
import useSession from "@/hooks/use-session";
import permissions from "@/config/permission";
import Loader from "@/components/loader";

export default function ActionCard({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = useSession(permissions.jobs.getJobById);
  const { data: job, isSuccess } = useGetJob({
    jobId: id,
    enabled: session.status === "authenticated",
  });

  const { mutate: confirm } = useConfirmJob();
  const { mutate: archive } = useArchiveJob();
  const { mutate: cancel } = useCancelJob();
  if (!isSuccess) {
    return <Loader />;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {job.status === "cancelled" && (
            <p className="text-center text-muted-foreground text-sm py-4">
              No Actions Avaialble
            </p>
          )}
          {job.status == "pending" && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Mark job as being confirmed
              </p>
              <Button
                onClick={() => confirm({ jobId: job.id })}
                variant={"outline"}
                className="bg-green-200 text-green-800 hover:text-green-800 hover:bg-green-200"
              >
                Confirm
              </Button>
            </div>
          )}
          {job.status === "pending" && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Mark the job as archived
              </p>
              <Button
                onClick={() => archive({ jobId: job.id })}
                variant={"outline"}
                className="bg-gray-200 text-gray-800 hover:text-gray-800 hover:bg-gray-200"
              >
                Archive
              </Button>
            </div>
          )}
          {job.status === "confirmed" && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Cancel a confirmed job
              </p>
              <Button
                variant={"outline"}
                onClick={() => cancel({ jobId: job.id })}
                className="bg-red-200 text-red-800 hover:text-red-800 hover:bg-red-200"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
