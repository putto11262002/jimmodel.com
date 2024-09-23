"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import WebAssetCreateForm from "../forms/web-asset-create-form";
import { useState } from "react";

export default function WebAssetCreateDialog({
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
          <DialogTitle>Create Web Asset</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <WebAssetCreateForm done={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
