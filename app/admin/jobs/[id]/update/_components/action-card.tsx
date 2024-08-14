"use client";
import { CardHeader, Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useArchive as useArchiveJob,
  useCancelJob,
  useConfrirmJob as useConfirmJob,
} from "@/hooks/queries/job";
import { Job } from "@/lib/types/job";

export default function ActionCard({ job }: { job: Job }) {
  const { mutate: confirm } = useConfirmJob();
  const { mutate: archive } = useArchiveJob();
  const { mutate: cancel } = useCancelJob();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
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
                className="h-7"
                size={"sm"}
                variant={"outline"}
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
                className="h-7"
                variant={"outline"}
                size={"sm"}
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
                onClick={() => cancel({ jobId: job.id })}
                className="h-7"
                variant={"outline"}
                size={"sm"}
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
