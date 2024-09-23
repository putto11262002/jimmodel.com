"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import LabelValueItem from "../key-value/key-value-item";
import {
  deleteContactMessageAction,
  markContactMessageAsReadAction,
} from "@/actions/contact-message";
import { useActionState, useEffect, useState } from "react";
import AsyncButton from "../shared/buttons/async-button";
import { Separator } from "../ui/separator";
import { ContactMessage } from "@/lib/domains";

export default function ContactMessageManageDialog({
  contactMessage,
  trigger,
}: {
  contactMessage: ContactMessage;
  trigger: React.ReactNode;
}) {
  const [state, markAsReadAction, markAsReadPending] = useActionState(
    markContactMessageAsReadAction,
    { status: "idle" }
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteContactMessageAction,
    { status: "idle" }
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (deleteState.status === "success") {
      setOpen(false);
    }
  }, [deleteState]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Contact Message</DialogTitle>
        </DialogHeader>
        <div className="py-4 grid gap-4">
          <LabelValueItem
            line="break"
            label="Name"
            size="sm"
            value={contactMessage.name}
          />
          <LabelValueItem
            line="break"
            label="Email"
            size="sm"
            value={contactMessage.email}
          />
          <LabelValueItem
            line="break"
            label="Phone"
            size="sm"
            value={contactMessage.phone}
          />
          <LabelValueItem
            line="break"
            label="Message"
            size="sm"
            value={contactMessage.message}
          />
          <Separator />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Mark contact message as read
            </p>
            <form action={markAsReadAction}>
              <input type="hidden" name="id" value={contactMessage.id} />
              <AsyncButton pending={markAsReadPending} size="sm">
                Mark as Read
              </AsyncButton>
            </form>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Delete contact message permanently
            </p>
            <form action={deleteAction}>
              <input type="hidden" name="id" value={contactMessage.id} />
              <AsyncButton
                variant={"destructive"}
                pending={deletePending}
                size="sm"
              >
                Delete
              </AsyncButton>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
