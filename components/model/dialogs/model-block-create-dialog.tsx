"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import ModelBlockCreateForm from "../blocks/form/model-block-create-form";

export default function ModelBlockCreateDialog({
  id,
  trigger,
}: {
  id: string;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Block</DialogTitle>
        </DialogHeader>
        <ModelBlockCreateForm modelId={id} done={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
