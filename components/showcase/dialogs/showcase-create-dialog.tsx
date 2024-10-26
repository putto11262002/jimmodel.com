"use client";
import { createShowcaseAction } from "@/actions/showcase";
import InputFormItem from "@/components/form/server-action/input-form-item";
import TextareaFormItem from "@/components/form/server-action/textarea-form-item";
import AsyncButton from "@/components/shared/buttons/async-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useActionState, useState } from "react";

export default function ShowcaseCreateDialog({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createShowcaseAction, {
    status: "idle",
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Showcase</DialogTitle>
        </DialogHeader>
        <div>
          <form action={action} className="grid gap-4">
            <InputFormItem name="title" label="Title" state={state} />
            <TextareaFormItem
              name="description"
              label="Description"
              state={state}
            />
            <div>
              <AsyncButton pending={pending} type="submit">
                Create
              </AsyncButton>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
