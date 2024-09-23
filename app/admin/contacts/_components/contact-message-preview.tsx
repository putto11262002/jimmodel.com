"use client";
import LabelValueItem from "@/components/key-value/key-value-item";
import { useContactMessagePreview } from "./contect-message-context";
import { formatDate } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CircleCheck, MailCheck, Trash } from "lucide-react";
import useActionState from "@/hooks/use-action-state";
import {
  deleteContactMessageAction,
  markContactMessageAsReadAction,
} from "@/actions/contact-message";
import IconButton from "@/components/icon-button";

export default function ContactMessagePreview() {
  const { selected, clearSelected } = useContactMessagePreview();
  const { dispatch: dispatchMarkAsRead } = useActionState(
    markContactMessageAsReadAction,
    { status: "idle" },
    { onSuccess: clearSelected }
  );
  const { dispatch: dispatchDelete } = useActionState(
    deleteContactMessageAction,
    { status: "idle" },
    { onSuccess: clearSelected }
  );
  if (!selected) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-muted-foreground text-center">
        No message selected
      </div>
    );
  }
  return (
    <div className="overflow-y-auto no-scrollbar">
      <div>
        <div className="flex md:justify-end justify-between border-b px-4 py-2 gap-4">
          <Button
            className="md:hidden"
            onClick={() => clearSelected()}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="icon-sm" />
          </Button>
          <div className="flex gap-2 items-center">
            {!selected.read && (
              <form action={dispatchMarkAsRead}>
                <input type="hidden" name="id" value={selected.id} />
                <IconButton
                  icon={<MailCheck className="icon-sm" />}
                  text="Mark as read"
                  size="sm"
                  variant="outline"
                ></IconButton>
              </form>
            )}

            {selected.read && (
              <IconButton
                icon={<CircleCheck className="icon-sm" />}
                text="Read"
                variant="success"
                size="sm"
              />
            )}

            <form action={dispatchDelete}>
              <input type="hidden" name="id" value={selected.id} />
              <IconButton
                icon={<Trash className="icon-sm" />}
                text="Delete"
                size="sm"
                variant="destructive"
              />
            </form>
          </div>
        </div>
        <div className="flex border-b p-4 items-stretch">
          <div className="grid gap-2 grow">
            <LabelValueItem size="sm" label="Name" value={selected.name} />
            <LabelValueItem size="sm" label="Email" value={selected.email} />
            <LabelValueItem size="sm" label="Phone" value={selected.phone} />
            <LabelValueItem
              size="sm"
              label="Sent at"
              value={formatDate(selected.createdAt, true)}
            />
          </div>
        </div>

        <div className="p-4 text-sm">{selected.message}</div>
      </div>
    </div>
  );
}
