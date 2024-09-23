"use client";
import { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Job } from "@/lib/domains";
import {
  archiveJobAction,
  cancelJobAction,
  confirmJobAction,
} from "@/actions/job";
import AsyncButton from "@/components/shared/buttons/async-button";
import { objToFormData } from "@/lib/utils/form-data";
import LabelValueItem from "@/components/key-value/key-value-item";
import { Card } from "@/components/card";
import useActionState from "@/hooks/use-action-state";

export default function JobActionCard({ job }: { job: Job }) {
  const { dispatch: confirmJob, pending: pendindConfirmJob } = useActionState(
    confirmJobAction,
    {
      status: "idle",
    }
  );
  const { dispatch: cancelJob, pending: pendingCancelJob } = useActionState(
    cancelJobAction,
    {
      status: "idle",
    }
  );
  const { dispatch: archiveJob, pending: pendingArchiveJob } = useActionState(
    archiveJobAction,
    {
      status: "idle",
    }
  );
  return (
    <Card
      headerBorder
      title={"Action"}
      description={"Actions that can be performed on this job."}
    >
      <div className="grid gap-4">
        {job.status === "pending" && (
          <LabelValueItem
            label="Mark Job as Confirmed"
            value={
              <div>
                <AsyncButton
                  size="sm"
                  variant="success"
                  pending={pendindConfirmJob}
                  onClick={() => confirmJob(objToFormData({ id: job.id }))}
                >
                  Confirm
                </AsyncButton>
              </div>
            }
            line="break"
            size="sm"
          />
        )}

        {job.status === "pending" && (
          <LabelValueItem
            label="Mark Job as Archived"
            value={
              <div>
                <AsyncButton
                  size="sm"
                  variant="secondary"
                  pending={pendingArchiveJob}
                  onClick={() => archiveJob(objToFormData({ id: job.id }))}
                >
                  Archive
                </AsyncButton>
              </div>
            }
            line="break"
            size="sm"
          />
        )}

        {job.status === "confirmed" && (
          <LabelValueItem
            label="Mark Job as Cancelled"
            value={
              <div>
                <AsyncButton
                  size="sm"
                  variant="destructive"
                  pending={pendingCancelJob}
                  onClick={() => cancelJob(objToFormData({ id: job.id }))}
                >
                  Cancel
                </AsyncButton>
              </div>
            }
            line="break"
            size="sm"
          />
        )}
        <Action
          name={"Download Confirmation"}
          description={"Download job confirmation PDF."}
          onAction={() => window.open(`/api/jobs/${job.id}/confirmation-sheet`)}
          variant={"secondary"}
        />
      </div>
    </Card>
  );
}

function Action({
  onAction,
  show,
  description,
  name,
  variant,
  className,
  pending,
}: {
  onAction?: () => void;
  show?: boolean;
  description?: string;
  name: string;
  variant?: ButtonProps["variant"];
  className?: string;
  pending?: boolean;
}) {
  if (show === false) {
    return null;
  }
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">{description}</p>
      <AsyncButton
        size="sm"
        onClick={() => onAction && onAction()}
        variant={variant}
        className={cn(className)}
        pending={pending}
      >
        {name}
      </AsyncButton>
    </div>
  );
}
