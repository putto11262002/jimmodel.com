"use client";
import type { Model } from "@/lib/domains";
import { useFormState } from "react-dom";
import { updateModelAction } from "@/actions/model";
import useActionToast from "@/hooks/use-action-toast";
import InputFormItem from "@/components/form/server-action/input-form-item";
import TextareaFormItem from "@/components/form/server-action/textarea-form-item";
import CheckboxFormItem from "@/components/form/server-action/checkbox-form-item";
import MultipleInputFormItem from "@/components/form/server-action/multiple-input";
import AsyncButton from "@/components/shared/buttons/async-button";

export default function ModelModelingForm({ model }: { model: Model }) {
  const [state, action, pending] = useFormState(updateModelAction, {
    status: "idle",
  });

  useActionToast({ state });

  return (
    <>
      <form action={action} className="grid gap-4">
        <input type="hidden" name="id" value={model.id} />
        <InputFormItem
          name="motherAgency"
          state={state}
          defaultValue={model.motherAgency}
          label="Mother Agency"
        />

        <TextareaFormItem
          name="aboutMe"
          label="About Me"
          state={state}
          defaultValue={model.aboutMe}
        />

        <CheckboxFormItem
          name="underwareShooting"
          label="Underware Shooting"
          state={state}
          defaultValue={model.underwareShooting}
        />

        <MultipleInputFormItem
          state={state}
          name="talents"
          label="Talents"
          defaultValue={model.talents}
        />

        <div className="flex justify-end">
          <AsyncButton pending={pending}>Save</AsyncButton>
        </div>
      </form>
    </>
  );
}
