"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ApplicationExperienceCreateForm from "../forms/application-experience-create-form";
import { useState } from "react";

export default function ApplicationExperienceCreateDialog({
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
          <DialogTitle>Add New Experience</DialogTitle>
        </DialogHeader>
        <div>
          <ApplicationExperienceCreateForm done={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
