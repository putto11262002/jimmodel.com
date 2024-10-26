"use client";
import { deleteShowcaseAction } from "@/actions/showcase";
import AsyncButton from "@/components/shared/buttons/async-button";
import { Showcase } from "@/lib/domains";
import { useActionState } from "react";

export default function ShowcaseDeleteForm({
  showcase,
}: {
  showcase: Showcase;
}) {
  const [state, action, pending] = useActionState(deleteShowcaseAction, {
    status: "idle",
  });
  return (
    <div className="grid gap-4">
      {!showcase.published && (
        <form action={action} className="grid gap-2">
          <p className="text-sm text-muted-foreground">
            Permanently delete the showcase
          </p>
          <input type="hidden" name="id" value={showcase.id} />
          <div>
            <AsyncButton variant="destructive" pending={pending} size="sm">
              Delete
            </AsyncButton>
          </div>
        </form>
      )}
    </div>
  );
}
