"use client";
import AsyncButton from "@/components/shared/buttons/async-button";
import {
  BOOKING_STATUS_LABEL_VALUE_PAIRS,
  ETHNICITY_LABEL_VALUE_PAIRS,
  GENER_LABEL_VALUE_PAIRS,
} from "@/db/constants";
import { useFormState } from "react-dom";
import { createModelAction } from "@/actions/model";
import InputFormItem from "@/components/form/server-action/input-form-item";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import DatetimePickerFormItem from "@/components/form/server-action/datetime-picker-form-item";
import useActionToast from "@/hooks/use-action-toast";

export default function ModelCreateForm() {
  const [state, action, pending] = useFormState(createModelAction, {
    status: "idle",
  });

  useActionToast({ state });

  return (
    <form className="grid gap-4" action={action}>
      <InputFormItem name="name" label="Name" state={state} />
      <SelectFormItem
        name="gender"
        label="Gender"
        state={state}
        options={GENER_LABEL_VALUE_PAIRS}
      />
      <SelectFormItem
        name="ethnicity"
        label="Ethnicity"
        state={state}
        options={ETHNICITY_LABEL_VALUE_PAIRS}
      />
      <DatetimePickerFormItem
        name="dateOfBirth"
        label="Date of Birth"
        state={state}
      />
      <SelectFormItem
        name="bookingStatus"
        label="Booking Status"
        state={state}
        options={BOOKING_STATUS_LABEL_VALUE_PAIRS}
      />

      <div>
        <AsyncButton type="submit" pending={pending}>
          Create
        </AsyncButton>
      </div>
    </form>
  );
}
