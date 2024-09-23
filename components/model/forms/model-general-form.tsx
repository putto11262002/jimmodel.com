"use client";
import type { Model } from "@/lib/domains";
import { useFormState } from "react-dom";
import { updateModelAction } from "@/actions/model";
import InputFormItem from "@/components/form/server-action/input-form-item";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import DatetimePickerFormItem from "@/components/form/server-action/datetime-picker-form-item";
import useActionToast from "@/hooks/use-action-toast";
import AsyncButton from "@/components/shared/buttons/async-button";
import { GENER_LABEL_VALUE_PAIRS } from "@/db/constants";

export default function ModelGeneralForm({ model }: { model: Model }) {
  const [state, action, pending] = useFormState(updateModelAction, {
    status: "idle",
  });
  useActionToast({ state });

  return (
    <>
      <form action={action} className="grid gap-4">
        <input type="hidden" name="id" value={model.id} />
        <InputFormItem
          defaultValue={model.name}
          name="name"
          state={state}
          label="Name"
        />
        <InputFormItem
          defaultValue={model.nickname}
          name="nickname"
          label="Nickname"
          state={state}
        />

        <SelectFormItem
          defaultValue={model.gender}
          name="gender"
          state={state}
          label="Gender"
          options={GENER_LABEL_VALUE_PAIRS}
        />

        <DatetimePickerFormItem
          label="Date of Birth"
          defaultValue={model.dateOfBirth}
          state={state}
          name="dateOfBirth"
        />

        <div className="flex justify-end">
          <AsyncButton pending={pending}>Save</AsyncButton>
        </div>
      </form>
    </>
  );
}
