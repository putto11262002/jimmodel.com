"use client";
import { createUserAction } from "@/actions/users";
import InputFormItem from "@/components/form/server-action/input-form-item";
import AsyncButton from "@/components/shared/buttons/async-button";
import useActionState from "@/hooks/use-action-state";

export default function UserCreateForm({
  done,
}: {
  done?: (id: string) => void;
}) {
  const { state, dispatch, pending } = useActionState(
    createUserAction,
    {
      status: "idle",
    },
    { onSuccess: (data) => done && done(data.data) }
  );

  return (
    <form action={dispatch} className="grid gap-4">
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
