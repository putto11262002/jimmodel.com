"use client";
import AsyncButton from "@/components/shared/buttons/async-button";
import {
  BOOKING_STATUS_LABEL_VALUE_PAIRS,
  ETHNICITY_LABEL_VALUE_PAIRS,
  GENER_LABEL_VALUE_PAIRS,
} from "@/db/constants";
import { createModelAction } from "@/actions/model";
import InputFormItem from "@/components/form/server-action/input-form-item";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import DatetimePickerFormItem from "@/components/form/server-action/datetime-picker-form-item";
import useActionState from "@/hooks/use-action-state";

export default function ModelCreateForm({
  done,
}: {
  done?: (args: { modelId: string }) => void;
}) {
  const { state, dispatch, pending } = useActionState(
    createModelAction,
    {
      status: "idle",
    },
    { onSuccess: (state) => done && done({ modelId: state.data }) }
  );

  return (
    <form className="grid gap-4" action={dispatch}>
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
