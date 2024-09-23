"use client";
import type { Model } from "@/lib/domains";
import { useFormState } from "react-dom";
import { updateModelAction } from "@/actions/model";
import useActionToast from "@/hooks/use-action-toast";
import { arrayToSelectOptions } from "@/components/utils/array-to-select-options";
import {
  EYE_COLOR_LABEL_VALUE_PAIRS,
  HAIR_COLOR_LABEL_VALUE_PAIRS,
} from "@/db/constants";
import CheckboxFormItem from "@/components/form/server-action/checkbox-form-item";
import InputFormItem from "@/components/form/server-action/input-form-item";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import AsyncButton from "@/components/shared/buttons/async-button";

export default function ModelMeasurementForm({ model }: { model: Model }) {
  const [state, action, pending] = useFormState(updateModelAction, {
    status: "idle",
  });
  useActionToast({ state });

  return (
    <>
      <form action={action} className="grid gap-6">
        <input type="hidden" name="id" value={model.id} />

        <FormSection title="Basic">
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
        </FormSection>
        <FormSection title="Upper Body">
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
        </FormSection>
        <FormSection title="Arms">
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
        </FormSection>
        <FormSection title="Lower Body">
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
        </FormSection>
        <FormSection title="Other">
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
        </FormSection>
        <div className="flex justify-end">
          <AsyncButton type="submit" pending={pending}>
            Save
          </AsyncButton>
        </div>
      </form>
    </>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <h3 className="font-semibold">{title}</h3>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}
