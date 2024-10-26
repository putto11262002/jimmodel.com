"use client";
import type { Model } from "@/lib/domains";
import { updateModelAction } from "@/actions/model";
import InputFormItem from "@/components/form/server-action/input-form-item";
import AsyncButton from "@/components/shared/buttons/async-button";
import useActionState from "@/hooks/use-action-state";

export default function ModelLowerBodyMeasurementForm({
  model,
}: {
  model: Model;
}) {
  const { pending, dispatch, state } = useActionState(updateModelAction, {
    status: "idle",
  });

  return (
    <>
      <form action={dispatch} className="grid gap-6">
        <input type="hidden" name="id" value={model.id} />

        <InputFormItem
          defaultValue={model.aroundThigh}
          name="aroundThigh"
          label="Around Thigh"
          state={state}
        />

        <InputFormItem
          defaultValue={model.aroundKnee}
          name="aroundKnee"
          label="Around Knee"
          state={state}
        />

        <InputFormItem
          defaultValue={model.aroundAnkle}
          name="aroundAnkle"
          label="Around Ankle"
          state={state}
        />

        <InputFormItem
          defaultValue={model.inSeam}
          name="inSeam"
          label="In Seam"
          state={state}
        />

        <InputFormItem
          defaultValue={model.outSeam}
          name="outSeam"
          label="Out Seam"
          state={state}
        />

        <InputFormItem
          defaultValue={model.crotch}
          name="crotch"
          label="Crotch"
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
