"use client";
import { Card } from "@/components/card";
import LabelValueItem from "@/components/key-value/key-value-item";
import { Job } from "@/lib/domains";
import JobOwnerBadge from "../job-owner-badge";
import AsyncButton from "@/components/shared/buttons/async-button";
import { Badge } from "@/components/ui/badge";
import { updateJobPermission } from "@/actions/job";
import { Separator } from "@/components/ui/separator";
import { Lock, Unlock } from "lucide-react";
import useActionState from "@/hooks/use-action-state";
import { AuthUser } from "@/lib/auth";

export default function JobPermissionCard({
  job,
  user,
}: {
  job: Job;
  user: AuthUser;
}) {
  const { dispatch, pending } = useActionState(updateJobPermission, {
    status: "idle",
  });
  return (
    <Card headerBorder title="Permissions">
      <div className="grid gap-4">
        <LabelValueItem
          label="Status"
          size="sm"
          line="break"
          value={
            <div>
              <Badge variant={job.private ? "destructive" : "success"}>
                <div className="flex items-center gap-2">
                  {job.private ? (
                    <Lock className="icon-sm" />
                  ) : (
                    <Unlock className="icon-sm" />
                  )}{" "}
                  <span>{job.private ? "Private" : "Public"}</span>
                </div>
              </Badge>
            </div>
          }
        />

        <LabelValueItem
          label="Owner"
          size="sm"
          line="break"
          value={
            <JobOwnerBadge
              owner={{
                id: job.ownerId,
                name: job.ownerName,
                imageId: job.ownerImageId,
              }}
            />
          }
        />
        {user.id === job.ownerId && (
          <>
            <Separator />
            {job.private && (
              <LabelValueItem
                label="Make the job public."
                line="break"
                size="sm"
                value={
                  <form action={dispatch}>
                    <input type="hidden" name="id" value={job.id} />
                    <input type="hidden" name="private" value="false" />
                    <AsyncButton pending={pending} variant={"success"}>
                      Public
                    </AsyncButton>
                  </form>
                }
              />
            )}
            {!job.private && (
              <LabelValueItem
                label="Make the job private."
                line="break"
                size="sm"
                value={
                  <form action={dispatch}>
                    <input type="hidden" name="id" value={job.id} />
                    <input type="hidden" name="private" value="true" />
                    <AsyncButton pending={pending} variant={"destructive"}>
                      Private
                    </AsyncButton>
                  </form>
                }
              />
            )}
          </>
        )}
      </div>
    </Card>
  );
}
