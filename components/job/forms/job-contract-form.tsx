"use client";
import { updateJobAction } from "@/actions/job";
import InputFormItem from "@/components/form/server-action/input-form-item";
import AsyncButton from "@/components/shared/buttons/async-button";
import useActionToast from "@/hooks/use-action-toast";
import { Job } from "@/lib/domains/types/job";
import { useActionState } from "react";

export default function JobContractForm({ job }: { job: Job }) {
  const [state, action, pending] = useActionState(updateJobAction, {
    status: "idle",
  });
  useActionToast({ state });
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="id" value={job.id} />
      <InputFormItem
        state={state}
        name="feeAsAgreed"
        label="Fee as Agreed"
        defaultValue={job.feeAsAgreed}
      />
      <InputFormItem
        state={state}
        name="termsOfPayment"
        label="Terms of Payment"
        defaultValue={job.termsOfPayment}
      />
      <InputFormItem
        state={state}
        name="overtimePerHour"
        label="Overtime per Hour"
        defaultValue={job.overtimePerHour}
      />
      <InputFormItem
        state={state}
        name="cancellationFee"
        label="Cancellation Fee"
        defaultValue={job.cancellationFee}
      />
      <InputFormItem
        state={state}
        name="contractDetails"
        label="Details"
        defaultValue={job.contractDetails}
      />
      <div className="flex justify-end">
        <AsyncButton pending={pending} type="submit">
          Save
        </AsyncButton>
      </div>
    </form>
  );
}
