"use client";
import type { Model } from "@/lib/domains";
import { updateModelAction } from "@/actions/model";
import {
  EYE_COLOR_LABEL_VALUE_PAIRS,
  HAIR_COLOR_LABEL_VALUE_PAIRS,
} from "@/db/constants";
import InputFormItem from "@/components/form/server-action/input-form-item";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import AsyncButton from "@/components/shared/buttons/async-button";
import useActionState from "@/hooks/use-action-state";

export default function ModelBasicMeasurementForm({ model }: { model: Model }) {
  const { dispatch, pending, state } = useActionState(updateModelAction);

  return (
    <>
      <form action={dispatch} className="grid gap-6">
        <input type="hidden" name="id" value={model.id} />

        <InputFormItem
          defaultValue={model.height}
          name="height"
          label="Height"
          state={state}
        />
        <InputFormItem
          defaultValue={model.weight}
          name="weight"
          label="Weight"
          state={state}
        />
        <InputFormItem
          defaultValue={model.chest}
          name="chest"
          label="Chest"
          state={state}
        />
        <InputFormItem
          defaultValue={model.bust}
          name="bust"
          label="Bust"
          state={state}
        />
        <InputFormItem
          defaultValue={model.waist}
          name="waist"
          label="Waist"
          state={state}
        />
        <InputFormItem
          defaultValue={model.hips}
          name="hips"
          label="Hips"
          state={state}
        />
        <InputFormItem
          defaultValue={model.shoeSize}
          name="shoeSize"
          label="Shoe Size"
          state={state}
        />
        <InputFormItem
          defaultValue={model.braSize}
          name="braSize"
          label="Bras Size"
          state={state}
        />

        <SelectFormItem
          defaultValue={model.eyeColor}
          state={state}
          name="eyeColor"
          label="Eye Color"
          options={EYE_COLOR_LABEL_VALUE_PAIRS}
        />
        <SelectFormItem
          defaultValue={model.hairColor}
          state={state}
          name="hairColor"
          label="Hair Color"
          options={HAIR_COLOR_LABEL_VALUE_PAIRS}
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
