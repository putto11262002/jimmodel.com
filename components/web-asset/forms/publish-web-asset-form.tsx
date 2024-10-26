"use client";
import { publishWebAssetAction } from "@/actions/web-asset";
import { useActionState } from "react";

export default function PublishWebAssetForm({
  id,
  trigger,
}: {
  id: string;
  trigger: React.ReactNode;
}) {
  const [state, action, pending] = useActionState(publishWebAssetAction, {
    status: "idle",
  });
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      {trigger}
    </form>
  );
}
