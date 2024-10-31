"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { JobCreateInput } from "@/lib/usecases";
import { useState } from "react";
import JobCreateForm from "../forms/job-create-form";
import routes from "@/config/routes";
import { useRouter } from "next/navigation";

export default function JobCreateDialog({
  status,
  trigger,
}: {
  status?: JobCreateInput["status"];
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDone = (id: string) => {
    setOpen(false);
    router.push(routes.admin.jobs["[id]"].edit.main({ id }));
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create {status === "pending" ? "Option" : "Job"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <JobCreateForm status={status} done={handleDone} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
