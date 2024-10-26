"use client";
import { createShowcaseImageAction } from "@/actions/showcase";
import InputFormItem from "@/components/form/server-action/input-form-item";
import IconButton from "@/components/icon-button";
import AsyncButton from "@/components/shared/buttons/async-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Showcase } from "@/lib/domains";
import { PlusCircle } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

export default function ShowcaseImageCreateDialog({
  showcase,
  trigger,
}: {
  showcase: Showcase;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createShowcaseImageAction, {
    status: "idle",
  });
  useEffect(() => {
    if (state.status === "success") {
      setOpen(false);
    }
  }, [state]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <IconButton
            size="sm"
            icon={<PlusCircle className="icon-sm" />}
            text="Image"
          />
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Showcase Image</DialogTitle>
        </DialogHeader>
        <div>
          <form action={action} className="grid gap-4">
            <InputFormItem
              name="file"
              label="Image"
              type="file"
              state={state}
            />
            <input type="hidden" name="id" value={showcase.id} />
            <div>
              <AsyncButton pending={pending} type="submit">
                Upload
              </AsyncButton>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
