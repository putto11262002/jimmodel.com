"use client";
import { rejectApplicationAction } from "@/actions/application";
import useActionToast from "@/hooks/use-action-toast";
import { useActionState } from "react";

export default function RejectApplcationForm({
  id,
  trigger,
}: {
  id: string;
  trigger: React.ReactNode;
}) {
  const [state, action, pending] = useActionState(rejectApplicationAction, {
    status: "idle",
  });
  useActionToast({ state });
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      {trigger}
    </form>
  );
}
