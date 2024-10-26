"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFormState } from "react-dom";
import { signInAction } from "@/actions/auth";
import AsyncButton from "../shared/buttons/async-button";
import InputFormItem from "../form/server-action/input-form-item";

export default function SignInForm() {
  const [state, action, pending] = useFormState(signInAction, {
    status: "idle",
  });

  return (
    <form action={action} className="grid gap-4">
      {state.status !== "idle" && state.message && (
        <div className="pt-2 pb-3">
          <Alert variant={state.status === "error" ? "destructive" : "default"}>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        </div>
      )}
      <InputFormItem name="username" label="Username" state={state} />
      <InputFormItem
        name="password"
        label="Password"
        state={state}
        type="password"
      />

      <AsyncButton pending={pending} type="submit" className="w-full">
        Login
      </AsyncButton>
    </form>
  );
}
