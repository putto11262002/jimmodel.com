"use client";
import type { Model } from "@/lib/domains";
import { useFormState } from "react-dom";
import { updateModelAction } from "@/actions/model";
import useActionToast from "@/hooks/use-action-toast";
import AsyncButton from "@/components/shared/buttons/async-button";
import InputFormItem from "@/components/form/server-action/input-form-item";

export default function ModelContactForm({ model }: { model: Model }) {
  const [state, action, pending] = useFormState(updateModelAction, {
    status: "idle",
  });

  useActionToast({ state });

  return (
    <>
      <form action={action} className="grid gap-4">
        <input type="hidden" name="id" value={model.id} />
        <InputFormItem
          name="phoneNumber"
          state={state}
          defaultValue={model.phoneNumber}
          label="Phone Number"
        />
        <InputFormItem
          name="email"
          state={state}
          defaultValue={model.email}
          label="Email"
        />

        <InputFormItem
          defaultValue={model.lineId}
          state={state}
          name="lineId"
          label="Line ID"
        />

        <InputFormItem
          name="whatsapp"
          state={state}
          defaultValue={model.whatsapp}
          label="Whatsapp"
        />

        <InputFormItem
          name="wechat"
          state={state}
          defaultValue={model.wechat}
          label="Wechat"
        />

        <InputFormItem
          name="instagram"
          state={state}
          defaultValue={model.instagram}
          label="Instagram"
        />

        <InputFormItem
          name="facebook"
          state={state}
          defaultValue={model.facebook}
          label="Facebook"
        />
        <div className="flex justify-end">
          <AsyncButton pending={pending}>Save</AsyncButton>
        </div>
      </form>
    </>
  );
}
