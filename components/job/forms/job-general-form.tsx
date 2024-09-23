"use client";
import { updateJobAction } from "@/actions/job";
import InputFormItem from "@/components/form/server-action/input-form-item";
import AsyncButton from "@/components/shared/buttons/async-button";
import useActionToast from "@/hooks/use-action-toast";
import { Job } from "@/lib/domains/types/job";
import { useActionState } from "react";

export default function JobGeneralForm({ job }: { job: Job }) {
  const [state, action, pending] = useActionState(updateJobAction, {
    status: "idle",
  });
  useActionToast({ state });
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="id" value={job.id} />
      <InputFormItem
        state={state}
        name="name"
        label="Name"
        defaultValue={job.name}
      />
      <InputFormItem
        state={state}
        name="product"
        label="Product"
        defaultValue={job.product}
      />
      <div className="flex justify-end">
        <AsyncButton pending={pending} type="submit">
          Save
        </AsyncButton>
      </div>
    </form>
  );
}
