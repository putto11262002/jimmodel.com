"use client";
import type { Model } from "@/lib/domains";
import { useFormState } from "react-dom";
import { updateModelAction } from "@/actions/model";
import useActionToast from "@/hooks/use-action-toast";
import AsyncButton from "@/components/shared/buttons/async-button";
import {
  COUNTRY_LABEL_KEY_PAIRS,
  ETHNICITY_LABEL_VALUE_PAIRS,
} from "@/db/constants";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import InputFormItem from "@/components/form/server-action/input-form-item";
import MultipleSelectFormItem from "@/components/form/server-action/multiple-select";

export default function ModelBackgroundForm({ model }: { model: Model }) {
  const [state, action, pending] = useFormState(updateModelAction, {
    status: "idle",
  });

  useActionToast({ state });

  return (
    <>
      <form action={action} className="grid gap-4">
        <input type="hidden" name="id" value={model.id} />
        <SelectFormItem
          state={state}
          name="nationality"
          label="Nationality"
          defaultValue={model.nationality}
          options={COUNTRY_LABEL_KEY_PAIRS}
        />

        <SelectFormItem
          state={state}
          name="ethnicity"
          label="Ethnicity"
          defaultValue={model.ethnicity}
          options={ETHNICITY_LABEL_VALUE_PAIRS}
        />

        <InputFormItem
          name="occupation"
          state={state}
          defaultValue={model.occupation}
          label="Occupation"
        />

        <InputFormItem
          name="highestLevelOfEducation"
          state={state}
          label="Highest Level of Education"
          defaultValue={model.highestLevelOfEducation}
        />

        <InputFormItem
          name="medicalInfo"
          state={state}
          defaultValue={model.medicalInfo}
          label="Medical Background (If applicable)"
        />

        <MultipleSelectFormItem
          name="spokenLanguages"
          state={state}
          label="Spoken Languages"
          defaultValue={model.spokenLanguages}
          options={COUNTRY_LABEL_KEY_PAIRS}
        />

        <div className="flex justify-end">
          <AsyncButton pending={pending}>Save</AsyncButton>
        </div>
      </form>
    </>
  );
}
