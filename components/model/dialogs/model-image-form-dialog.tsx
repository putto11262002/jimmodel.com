"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ModelImageForm from "../forms/model-image-upload-form";
import { useState } from "react";

export default function ModelImageFormDialog({
  trigger,
  modelId,
}: {
  trigger: React.ReactNode;
  modelId: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload New Model Image</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <ModelImageForm done={() => setOpen(false)} modelId={modelId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
