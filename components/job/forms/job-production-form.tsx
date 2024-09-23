"use client";
import { updateJobAction } from "@/actions/job";
import InputFormItem from "@/components/form/server-action/input-form-item";
import AsyncButton from "@/components/shared/buttons/async-button";
import useActionToast from "@/hooks/use-action-toast";
import { Job } from "@/lib/domains/types/job";
import { useActionState } from "react";

export default function JobProductionDetailsForm({ job }: { job: Job }) {
  const [state, action, pending] = useActionState(updateJobAction, {
    status: "idle",
  });
  useActionToast({ state });
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="id" value={job.id} />
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
      <div className="flex justify-end">
        <AsyncButton pending={pending} type="submit">
          Save
        </AsyncButton>
      </div>
    </form>
  );
}
