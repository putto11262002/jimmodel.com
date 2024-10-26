"use client";
import { unpublishWebAssetAction } from "@/actions/web-asset";
import { useActionState } from "react";

export default function UnpublishWebAssetForm({
  id,
  trigger,
}: {
  id: string;
  trigger: React.ReactNode;
}) {
  const [state, action, pending] = useActionState(unpublishWebAssetAction, {
    status: "idle",
  });
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      {trigger}
    </form>
  );
}
