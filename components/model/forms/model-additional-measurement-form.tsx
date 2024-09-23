"use client";
import type { Model } from "@/lib/domains";
import { updateModelAction } from "@/actions/model";
import CheckboxFormItem from "@/components/form/server-action/checkbox-form-item";
import AsyncButton from "@/components/shared/buttons/async-button";
import useActionState from "@/hooks/use-action-state";

export default function ModelAdditionalMeasurementForm({
  model,
}: {
  model: Model;
}) {
  const { dispatch, pending, state } = useActionState(updateModelAction, {
    status: "idle",
  });

  return (
    <>
      <form action={dispatch} className="grid gap-6">
        <input type="hidden" name="id" value={model.id} />

        <CheckboxFormItem
          name="tattoos"
          label="Tattoos"
          defaultValue={model.tattoos}
          state={state}
        />
        <CheckboxFormItem
          name="scars"
          label="Scars"
          defaultValue={model.scars}
          state={state}
        />
        <div className="flex justify-end">
          <AsyncButton type="submit" pending={pending}>
            Save
          </AsyncButton>
        </div>
      </form>
    </>
  );
}
