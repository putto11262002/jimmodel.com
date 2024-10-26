"use client";
import type { Model } from "@/lib/domains";
import { updateModelAction } from "@/actions/model";
import InputFormItem from "@/components/form/server-action/input-form-item";
import AsyncButton from "@/components/shared/buttons/async-button";
import useActionState from "@/hooks/use-action-state";

export default function ModelUpperBodyMeasurementForm({
  model,
}: {
  model: Model;
}) {
  const { dispatch, pending, state } = useActionState(updateModelAction);

  return (
    <>
      <form action={dispatch} className="grid gap-6">
        <input type="hidden" name="id" value={model.id} />
        <InputFormItem
          defaultValue={model.collar}
          name="collar"
          label="Collar"
          state={state}
        />

        <InputFormItem
          defaultValue={model.chestHeight}
          name="chestHeight"
          label="Chest Height"
          state={state}
        />

        <InputFormItem
          defaultValue={model.chestWidth}
          name="chestWidth"
          label="Chest Width"
          state={state}
        />

        <InputFormItem
          defaultValue={model.shoulder}
          name="shoulder"
          label="Shoulder"
          state={state}
        />

        <InputFormItem
          defaultValue={model.aroundArmpit}
          name="aroundArmpit"
          label="Around Armpit"
          state={state}
        />

        <InputFormItem
          defaultValue={model.frontShoulder}
          name="frontShoulder"
          label="Front Shoulder"
          state={state}
        />

        <InputFormItem
          defaultValue={model.frontLength}
          name="frontLength"
          label="Front Length"
          state={state}
        />

        <InputFormItem
          defaultValue={model.backShoulder}
          name="backShoulder"
          label="Back Shoulder"
          state={state}
        />

        <InputFormItem
          defaultValue={model.backLength}
          name="backLength"
          label="Back Length"
          state={state}
        />
        <InputFormItem
          defaultValue={model.aroundUpperArm}
          name="aroundUpperArm"
          label="Around Upper Arm"
          state={state}
        />

        <InputFormItem
          defaultValue={model.aroundElbow}
          name="aroundElbow"
          label="Around Elbow"
          state={state}
        />

        <InputFormItem
          defaultValue={model.aroundWrist}
          name="aroundWrist"
          label="Around Wrist"
          state={state}
        />

        <InputFormItem
          defaultValue={model.shoulderToWrist}
          name="shoulderToWrist"
          label="Shoulder to Wrist"
          state={state}
        />

        <InputFormItem
          defaultValue={model.shoulderToElbow}
          name="shoulderToElbow"
          label="Shoulder to Elbow"
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
