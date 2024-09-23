"use client";
import { upodateShowcaseAction } from "@/actions/showcase";
import InputFormItem from "@/components/form/server-action/input-form-item";
import TextareaFormItem from "@/components/form/server-action/textarea-form-item";
import AsyncButton from "@/components/shared/buttons/async-button";
import { Showcase } from "@/lib/domains";
import { useActionState } from "react";

export default function ShowcaseGeneralForm({
  showcase,
}: {
  showcase: Pick<Showcase, "id" | "title" | "description">;
}) {
  const [state, action, pending] = useActionState(upodateShowcaseAction, {
    status: "idle",
  });
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="id" value={showcase.id} />
      <InputFormItem
        name="title"
        label="Title"
        state={state}
        defaultValue={showcase.title}
      />
      <TextareaFormItem
        name="description"
        label="Description"
        state={state}
        defaultValue={showcase.description}
      />
      <div>
        <AsyncButton size="sm" pending={pending} type="submit">
          Save
        </AsyncButton>
      </div>
    </form>
  );
}
