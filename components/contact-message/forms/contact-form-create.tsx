"use client";
import { createContactMessageAction } from "@/actions/contact-message";
import InputFormItem from "@/components/form/server-action/input-form-item";
import TextareaFormItem from "@/components/form/server-action/textarea-form-item";
import AsyncButton from "@/components/shared/buttons/async-button";
import { useActionState, useEffect } from "react";

export default function ContactMessageCreateForm({
  done,
}: {
  done?: () => void;
}) {
  const [state, action, pending] = useActionState(createContactMessageAction, {
    status: "idle",
  });
  useEffect(() => {
    if (state.status === "success" && done) {
      done();
    }
  }, [state]);
  return (
    <form action={action} className="grid gap-4">
      <InputFormItem name="name" label="Name" state={state} />
      <InputFormItem name="phone" label="Phone Number" state={state} />
      <InputFormItem name="email" label="Email" state={state} />
      <TextareaFormItem name="message" label="Message" state={state} />
      <AsyncButton pending={pending}>Send</AsyncButton>
    </form>
  );
}
