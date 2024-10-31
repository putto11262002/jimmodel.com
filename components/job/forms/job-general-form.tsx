"use client";
import { updateJobAction } from "@/actions/job";
import InputFormItem from "@/components/form/server-action/input-form-item";
import AsyncButton from "@/components/shared/buttons/async-button";
import { Separator } from "@/components/ui/separator";
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

      <h3 className="font-medium underline">Basic</h3>
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
      <h3 className="font-medium mt-2 underline">Client</h3>
      <InputFormItem
        state={state}
        name="client"
        label="Client"
        defaultValue={job.client}
      />
      <InputFormItem
        state={state}
        name="clientAddress"
        label="Client Address"
        defaultValue={job.clientAddress}
      />
      <InputFormItem
        state={state}
        name="personInCharge"
        label="Person in Charge"
        defaultValue={job.personInCharge}
      />

      <h3 className="font-medium mt-2 underline">Client</h3>
      <InputFormItem
        state={state}
        name="mediaReleased"
        label="Media Released"
        defaultValue={job.mediaReleased}
      />
      <InputFormItem
        state={state}
        name="territoriesReleased"
        label="Territories Released"
        defaultValue={job.territoriesReleased}
      />
      <InputFormItem
        state={state}
        name="periodReleased"
        label="Period Released"
        defaultValue={job.periodReleased}
      />

      <InputFormItem
        state={state}
        name="workingHour"
        label="Working Hour"
        defaultValue={job.workingHour}
      />

      <InputFormItem
        state={state}
        name="venueOfShoot"
        label="Venue of Shoot"
        defaultValue={job.venueOfShoot}
      />

      <h3 className="font-medium mt-2 underline">Contract</h3>
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
