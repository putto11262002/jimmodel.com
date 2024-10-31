"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Job } from "@/lib/domains";
import { useState } from "react";
import BookingCreateForm from "../forms/booking-create-form";

export default function BookingCreateDialog({
  job,
  trigger,
}: {
  job: Job;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Booking for {job.name}</DialogTitle>
        </DialogHeader>
	<div className="py4">
        <BookingCreateForm done={() => setOpen(false)} jobId={job.id} />
	</div>
      </DialogContent>
    </Dialog>
  );
}
