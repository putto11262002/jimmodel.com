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

export default function ApplicationContactForm({
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
      <input type="hidden" name="form" value="contact" />
      <InputFormItem
        name="email"
        defaultValue={application.email}
        label="Email"
        state={state}
      />
      <InputFormItem
        name="phoneNumber"
        label="Phone Number"
        defaultValue={application.phoneNumber}
        state={state}
      />

      <InputFormItem
        name="lineId"
        label="Line ID"
        defaultValue={application.lineId}
        state={state}
      />

      <InputFormItem
        name="whatsapp"
        label="WhatsApp"
        defaultValue={application.whatsapp}
        state={state}
      />

      <InputFormItem
        name="wechat"
        label="WeChat"
        defaultValue={application.wechat}
        state={state}
      />

      <InputFormItem
        name="instagram"
        label="Instagram"
        defaultValue={application.instagram}
        state={state}
      />

      <InputFormItem
        name="facebook"
        label="Facebook"
        defaultValue={application.facebook}
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
