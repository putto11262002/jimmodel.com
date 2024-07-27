"use client";
import { CardHeader, Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  useArchive as useArchiveJob,
  useCancelJob,
  useConfrirmJob as useConfirmJob,
  useGetJob,
} from "@/hooks/queries/job";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActionCard({ jobId }: { jobId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <ActionCardContent jobId={jobId} />
      </CardContent>
    </Card>
  );
}

function ActionCardContent({ jobId }: { jobId: string }) {
  const { data, isSuccess } = useGetJob({ jobId });
  const { mutate: confirm } = useConfirmJob();
  const { mutate: archive } = useArchiveJob();
  const { mutate: cancel } = useCancelJob();
  if (!isSuccess) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {data.status === "cancelled" && (
        <p className="text-center text-muted-foreground text-sm py-4">
          No Actions Avaialble
        </p>
      )}
      {data.status == "pending" && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Mark job as being confirmed
          </p>
          <Button
            onClick={() => confirm({ jobId })}
            className="h-7"
            size={"sm"}
            variant={"outline"}
          >
            Confirm
          </Button>
        </div>
      )}
      {data.status === "pending" && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Mark the job as archived
          </p>
          <Button
            onClick={() => archive({ jobId })}
            className="h-7"
            variant={"outline"}
            size={"sm"}
          >
            Archive
          </Button>
        </div>
      )}
      {data.status === "confirmed" && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Cancel a confirmed job
          </p>
          <Button
            onClick={() => cancel({ jobId })}
            className="h-7"
            variant={"outline"}
            size={"sm"}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
