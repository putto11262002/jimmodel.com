"use client";
import { submitApplicationAction } from "@/actions/application";
import CheckboxFormItem from "@/components/form/server-action/checkbox-form-item";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";

export default function ApplicationSubmissionForm({
  disabled,
}: {
  disabled?: boolean;
}) {
  const [state, action, pending] = useActionState(submitApplicationAction, {
    status: "idle",
  });
  return (
    <form className="grid gap-4" action={action}>
      <CheckboxFormItem
        disabled={disabled}
        name="termsOfService"
        state={state}
        label={
          <span>
            I agree to the{" "}
            <a className="underline" href="/privacy-policy" target="_blank">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/terms-of-service" target="_blank">
              Terms of Service
            </a>
            .
          </span>
        }
      />

      <CheckboxFormItem
        disabled={disabled}
        name="privacyPolicy"
        state={state}
        label={
          <span>
            I have read and accept the{" "}
            <a className="underline" href="/privacy-policy" target="_blank">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/terms-of-service" target="_blank">
              Terms of Service
            </a>
            .
          </span>
        }
      />

      <Button disabled={disabled}>
        Submit My Application
        {pending && <Loader2 className="icon-sm animate-spin ml-2" />}
      </Button>
    </form>
  );
}
