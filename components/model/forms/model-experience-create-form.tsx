"use client";
import { addModelExperienceAction } from "@/actions/model";
import InputFormItem from "@/components/form/server-action/input-form-item";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import AsyncButton from "@/components/shared/buttons/async-button";
import { COUNTRY_LABEL_KEY_PAIRS } from "@/db/constants";
import useActionToast from "@/hooks/use-action-toast";
import { useEffect } from "react";
import { useFormState } from "react-dom";

export default function ModelExperienceCreateForm({
  done,
  modelId,
}: {
  done?: () => void;
  modelId: string;
}) {
  const [state, action, pending] = useFormState(addModelExperienceAction, {
    status: "idle",
  });

  useActionToast({ state });

  useEffect(() => {
    if (state.status === "success") {
      done && done();
    }
  }, [state]);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="id" value={modelId} />
      <InputFormItem name="year" label="Year" state={state} type="number" />
      <InputFormItem name="media" label="Media" state={state} />
      <InputFormItem name="product" label="Product" state={state} />
      <SelectFormItem
        name="country"
        label="Country"
        state={state}
        options={COUNTRY_LABEL_KEY_PAIRS}
      />

      <div className="flex justify-end">
        <AsyncButton pending={pending}>Save</AsyncButton>
      </div>
    </form>
  );
}
