"use client";
import {
  publishShowcaseAction,
  unpublishShowcaseAction,
} from "@/actions/showcase";
import Alert from "@/components/alert";
import AsyncButton from "@/components/shared/buttons/async-button";
import { Button } from "@/components/ui/button";
import { Showcase } from "@/lib/domains";
import { camelCaseToText } from "@/lib/utils/text";
import { useActionState } from "react";

export default function ShowcasePublishForm({
  showcase,
}: {
  showcase: Showcase;
}) {
  const [publishState, publishAction, publishPending] = useActionState(
    publishShowcaseAction,
    { status: "idle" }
  );
  const [_, unpublishAction, unpublishPending] = useActionState(
    unpublishShowcaseAction,
    { status: "idle" }
  );
  return (
    <div className="grid gap-4">
      {publishState.status === "validationError" &&
        Object.entries(publishState.data).map(([_, value], index) => (
          <Alert key={index} variant="error">
            {value}
          </Alert>
        ))}
      {!showcase.published && (
        <form action={publishAction} className="grid gap-2">
          <p className="text-sm text-muted-foreground">
            Display the showcase on the public site
          </p>
          <input type="hidden" name="id" value={showcase.id} />
          <div>
            <AsyncButton variant="success" pending={publishPending} size="sm">
              Publish
            </AsyncButton>
          </div>
        </form>
      )}
      {showcase.published && (
        <form action={unpublishAction} className="grid gap-2">
          <p className="text-sm text-muted-foreground">
            Hide the showcase on the public site
          </p>
          <input type="hidden" name="id" value={showcase.id} />
          <div>
            <AsyncButton variant="warning" pending={unpublishPending} size="sm">
              Unpublish
            </AsyncButton>
          </div>
        </form>
      )}
    </div>
  );
}
