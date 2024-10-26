"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import ModelCreateForm from "../forms/model-create-form";
import { useRouter } from "next/navigation";
import routes from "@/config/routes";

export default function ModelCreateDialog({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const onDone = ({ modelId }: { modelId: string }) => {
    setOpen(false);
    router.push(routes.admin.models["[id]"].main({ id: modelId }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <ModelCreateForm done={onDone} />
      </DialogContent>
    </Dialog>
  );
}
