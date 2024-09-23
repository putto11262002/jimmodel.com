"use client";
import { Application } from "@/lib/domains";
import { useActionState } from "react";
import { FieldsValidationError } from "@/actions/common/validation-error";
import { CompletedApplication } from "@/lib/usecases/application/inputs";
import { ActionResult } from "@/actions/common/action-result";
import { updateApplicationAction } from "@/actions/application";
import AsyncButton from "@/components/shared/buttons/async-button";
import useActionToast from "@/hooks/use-action-toast";
import MultipleInputFormItem from "@/components/form/server-action/multiple-input";

export default function ApplicationTalentForm({
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
      <input type="hidden" name="form" value="talent" />
      <MultipleInputFormItem
        name="talents"
        state={state}
        defaultValue={application.talents}
        label="Talents"
      />

      <div className="flex justify-end">
        <AsyncButton type="submit" pending={pending}>
          Save
        </AsyncButton>
      </div>
    </form>
  );
}
