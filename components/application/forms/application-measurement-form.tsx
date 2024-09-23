"use client";
import InputFormItem from "@/components/form/server-action/input-form-item";
import { Application } from "@/lib/domains";
import { useActionState } from "react";
import { FieldsValidationError } from "@/actions/common/validation-error";
import { CompletedApplication } from "@/lib/usecases/application/inputs";
import { ActionResult } from "@/actions/common/action-result";
import { updateApplicationAction } from "@/actions/application";
import AsyncButton from "@/components/shared/buttons/async-button";
import useActionToast from "@/hooks/use-action-toast";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import { arrayToSelectOptions } from "@/components/utils/array-to-select-options";
import {
  EYE_COLOR_LABEL_VALUE_PAIRS,
  HAIR_COLOR_LABEL_VALUE_PAIRS,
} from "@/db/constants";

export default function ApplicationMeasurementForm({
  initialState,
  application,
}: {
  application: Application;
  initialState?: ActionResult<
    "validationError",
    FieldsValidationError<CompletedApplication>
  >;
}) {
  const [state, action, pending] = useActionState(
    updateApplicationAction,
    initialState ? initialState : { status: "idle" }
  );
  useActionToast({ state });
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="form" value="measurement" />
      <InputFormItem
        name="height"
        defaultValue={application.height}
        type="number"
        label="Height (cm)"
        state={state}
      />
      <InputFormItem
        name="weight"
        label="Weight (kg)"
        defaultValue={application.weight}
        state={state}
        type="number"
      />

      <InputFormItem
        name="chest"
        label="Chest (inches)"
        defaultValue={application.chest}
        state={state}
        type="number"
      />

      <InputFormItem
        name="bust"
        label="Bust (inches)"
        defaultValue={application.bust}
        state={state}
        type="number"
      />

      <InputFormItem
        name="hips"
        label="Hips (inches)"
        defaultValue={application.hips}
        state={state}
        type="number"
      />

      <InputFormItem
        name="shoeSize"
        label="Shoe Size"
        defaultValue={application.shoeSize}
        state={state}
      />

      <SelectFormItem
        name="hairColor"
        label="Hair Color"
        defaultValue={application.hairColor}
        state={state}
        options={HAIR_COLOR_LABEL_VALUE_PAIRS}
      />

      <SelectFormItem
        name="eyeColor"
        label="Eye Color"
        defaultValue={application.eyeColor}
        state={state}
        options={EYE_COLOR_LABEL_VALUE_PAIRS}
      />

      <div className="flex justify-end">
        <AsyncButton type="submit" pending={pending}>
          Save
        </AsyncButton>
      </div>
    </form>
  );
}
