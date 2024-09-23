"use client";
import type { Model } from "@/lib/domains";
import { useFormState } from "react-dom";
import { updateModelAction } from "@/actions/model";
import useActionToast from "@/hooks/use-action-toast";
import InputFormItem from "@/components/form/server-action/input-form-item";
import AsyncButton from "@/components/shared/buttons/async-button";

export default function ModelIdenticationForm({ model }: { model: Model }) {
  const [state, action, pending] = useFormState(updateModelAction, {
    status: "idle",
  });

  useActionToast({ state });

  return (
    <>
      <form action={action} className="grid gap-4">
        <input type="hidden" name="id" value={model.id} />
        <InputFormItem
          name="passportNumber"
          state={state}
          defaultValue={model.passportNumber}
          label="Passport Number"
        />
        <InputFormItem
          name="idCardNumber"
          state={state}
          defaultValue={model.idCardNumber}
          label="Thai ID Card Number (If application)"
        />

        <InputFormItem
          name="taxId"
          state={state}
          defaultValue={model.taxId}
          label="Tax ID"
        />

        <div className="flex justify-end">
          <AsyncButton pending={pending}>Save</AsyncButton>
        </div>
      </form>
    </>
  );
}
