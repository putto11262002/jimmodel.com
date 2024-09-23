"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ModelExperienceCreateForm from "../forms/model-experience-create-form";
import { useState } from "react";

export default function ModelExperienceCreateDialog({
  modelId,
  trigger,
}: {
  modelId: string;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Experience</DialogTitle>
        </DialogHeader>
        <div>
          <ModelExperienceCreateForm
            modelId={modelId}
            done={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
