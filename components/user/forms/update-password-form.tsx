"use client";
import { resetPasswordAction } from "@/actions/users";
import InputFormItem from "@/components/form/server-action/input-form-item";
import AsyncButton from "@/components/shared/buttons/async-button";
import useActionToast from "@/hooks/use-action-toast";
import { useFormState } from "react-dom";

export default function UpdateUserPasswordForm({ id }: { id: string }) {
  const [state, action, pending] = useFormState(resetPasswordAction, {
    status: "idle",
  });
  useActionToast({ state });
  return (
    <form action={action}>
      <div className="grid gap-4">
        <input type="hidden" name="id" value={id} />
        <InputFormItem
          name="password"
          label="New Password"
          state={state}
          type="password"
        />

        <InputFormItem
          name="confirmPassword"
          label="Confirm Password"
          state={state}
          type="password"
        />

        <div className="flex justify-end">
          <AsyncButton pending={pending}>Reset</AsyncButton>
        </div>
      </div>
    </form>
  );
}
