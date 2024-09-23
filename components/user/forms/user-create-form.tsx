"use client";
import { createUserAction } from "@/actions/users";
import InputFormItem from "@/components/form/server-action/input-form-item";
import AsyncButton from "@/components/shared/buttons/async-button";
import useActionToast from "@/hooks/use-action-toast";
import { useFormState } from "react-dom";

export default function UserCreateForm() {
  const [state, action, pending] = useFormState(createUserAction, {
    status: "idle",
  });

  useActionToast({ state });

  return (
    <form action={action} className="grid gap-4">
      <InputFormItem name="name" label="Name" state={state} />

      <InputFormItem name="email" label="Email" state={state} />

      <InputFormItem name="username" label="Username" state={state} />

      <InputFormItem
        name="password"
        label="Password"
        state={state}
        type="password"
      />

      <InputFormItem
        name="confirmPassword"
        label="Confirm Password"
        state={state}
        type="password"
      />

      <div className="flex justify-end col-span-full">
        <AsyncButton pending={pending}>Save</AsyncButton>
      </div>
    </form>
  );
}
