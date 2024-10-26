"use client";
import { createModelBlockAction } from "@/actions/model";
import DatetimePickerFormItem from "@/components/form/server-action/datetime-picker-form-item";
import TextareaFormItem from "@/components/form/server-action/textarea-form-item";
import { Button } from "@/components/ui/button";
import useActionToast from "@/hooks/use-action-toast";
import { Loader2 } from "lucide-react";
import { useActionState, useEffect } from "react";

export default function ModelBlockCreateForm({
  modelId,
  done,
}: {
  modelId: string;
  done?: () => void;
}) {
  const [state, action, pending] = useActionState(createModelBlockAction, {
    status: "idle",
  });
  useActionToast({ state });
  useEffect(() => {
    if (state.status === "success" && done) {
      done();
    }
  }, [state.status]);
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="modelId" value={modelId} />
      <DatetimePickerFormItem state={state} label="Start Date" name="start" />
      <DatetimePickerFormItem state={state} label="End Date" name="end" />
      <TextareaFormItem state={state} name="reason" label="Reason" />
      <div className="flex justify-end">
        <Button disabled={pending} type="submit">
          {pending ? <Loader2 className="animate-spin h-4 w-4" /> : "Create"}
        </Button>
      </div>
    </form>
  );
}
