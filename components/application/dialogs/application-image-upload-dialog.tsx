"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import ApplicationImageUploadForm from "../forms/application-image-upload-form";

export default function ApplicationImageUploadDialog({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Application Image</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <ApplicationImageUploadForm done={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
