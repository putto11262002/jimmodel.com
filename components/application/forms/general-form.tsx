"use client";
import InputFormItem from "@/components/form/server-action/input-form-item";
import { Application } from "@/lib/domains";
import { useActionState } from "react";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import DatetimePickerFormItem from "@/components/form/server-action/datetime-picker-form-item";
import { FieldsValidationError } from "@/actions/common/validation-error";
import { CompletedApplication } from "@/lib/usecases/application/inputs";
import { ActionResult } from "@/actions/common/action-result";
import { updateApplicationAction } from "@/actions/application";
import AsyncButton from "@/components/shared/buttons/async-button";
import useActionToast from "@/hooks/use-action-toast";
import TextareaFormItem from "@/components/form/server-action/textarea-form-item";
import {
  COUNTRY_LABEL_KEY_PAIRS,
  ETHNICITY_LABEL_VALUE_PAIRS,
  GENER_LABEL_VALUE_PAIRS,
} from "@/db/constants";

export default function ApplicationGeneralForm({
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
      <input type="hidden" name="form" value="general" />
      <InputFormItem
        name="name"
        defaultValue={application.name}
        label="Name"
        state={state}
      />
      <SelectFormItem
        name="gender"
        label="Gender"
        defaultValue={application.gender}
        state={state}
        options={GENER_LABEL_VALUE_PAIRS}
      />

      <DatetimePickerFormItem
        name="dateOfBirth"
        label="Date of Birth"
        defaultValue={application.dateOfBirth}
        state={state}
      />

      <SelectFormItem
        name="ethnicity"
        label="Ethnicity"
        defaultValue={application.ethnicity}
        options={ETHNICITY_LABEL_VALUE_PAIRS}
        state={state}
      />

      <SelectFormItem
        name="nationality"
        label="Nationality"
        defaultValue={application.nationality}
        options={COUNTRY_LABEL_KEY_PAIRS}
        state={state}
      />
      <TextareaFormItem
        description="Provide a brief overview of yourself, including your background, modeling experience, and unique qualities that set you apart in the industry."
        name="aboutMe"
        label="About Me"
        defaultValue={application.aboutMe}
        state={state}
      />
      <div className="flex justify-end">
        <AsyncButton type="submit" pending={pending}>
          Save
        </AsyncButton>
      </div>
    </form>
  );
}
