"use client";
import { createJobAction } from "@/actions/job";
import InputFormItem from "@/components/form/server-action/input-form-item";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import AsyncButton from "@/components/shared/buttons/async-button";
import useActionToast from "@/hooks/use-action-toast";
import { JobCreateInput } from "@/lib/usecases/job/inputs";
import { useActionState, useEffect } from "react";

export default function JobCreateForm({
  status,
  done,
}: {
  status?: JobCreateInput["status"];
  done?: () => void;
}) {
  const [state, action, pending] = useActionState(createJobAction, {
    status: "idle",
  });
  useActionToast({ state });
  useEffect(() => {
    if (state.status === "success" && done) {
      done();
    }
  }, [state]);

  return (
    <form action={action} className="grid gap-4">
      <InputFormItem name="name" label="Name" state={state} />
      {status ? (
        <input type="hidden" name="status" value={status} />
      ) : (
        <SelectFormItem
          name="status"
          label="Status"
          state={state}
          options={[
            { label: "Confirm", value: "confirm" },
            { label: "Pending", value: "pending" },
          ]}
        />
      )}
      <div className="flex justify-end">
        <AsyncButton pending={pending}>Create</AsyncButton>
      </div>
    </form>
  );
}
