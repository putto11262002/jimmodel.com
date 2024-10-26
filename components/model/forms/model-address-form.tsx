"use client";
import type { Model } from "@/lib/domains";
import { useFormState } from "react-dom";
import { updateModelAction } from "@/actions/model";
import useActionToast from "@/hooks/use-action-toast";
import AsyncButton from "@/components/shared/buttons/async-button";
import { arrayToSelectOptions } from "@/components/utils/array-to-select-options";
import InputFormItem from "@/components/form/server-action/input-form-item";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import { COUNTRY_LABEL_KEY_PAIRS } from "@/db/constants";

export default function ModelAddressForm({ model }: { model: Model }) {
  const [state, action, pending] = useFormState(updateModelAction, {
    status: "idle",
  });

  useActionToast({ state });

  return (
    <>
      <form action={action} className="grid gap-4">
        <input type="hidden" name="id" value={model.id} />
        <InputFormItem
          name="address"
          state={state}
          defaultValue={model.address}
          label="Address"
        />
        <InputFormItem
          name="city"
          state={state}
          defaultValue={model.city}
          label="City"
        />

        <InputFormItem
          name="region"
          state={state}
          defaultValue={model.region}
          label="Region/State"
        />

        <InputFormItem
          name="zipCode"
          state={state}
          defaultValue={model.zipCode}
          label="Zip Code"
        />

        <SelectFormItem
          name="country"
          state={state}
          defaultValue={model.country}
          label="Country"
          options={COUNTRY_LABEL_KEY_PAIRS}
        />

        <div className="flex justify-end">
          <AsyncButton pending={pending}>Save</AsyncButton>
        </div>
      </form>
    </>
  );
}
