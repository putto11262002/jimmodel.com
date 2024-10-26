"use client";
import { ContactMessage } from "@/lib/domains";
import { formatDate } from "@/lib/utils/date";
import { truncate } from "lodash";
import { useContactMessagePreview } from "./contect-message-context";
import { cn } from "@/lib/utils";

export default function ContactMessageCard({
  contactMessage,
}: {
  contactMessage: ContactMessage;
}) {
  const { setSelected, selected, clearSelected } = useContactMessagePreview();
  return (
    <div
      onClick={() => setSelected(contactMessage)}
      className={cn(
        "border px-4 py-3 rounded-lg grid gap-2 hover:bg-accent cursor-pointer",
        selected?.id === contactMessage.id &&
          "bg-accent border-accent-foreground"
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm">{contactMessage.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatDate(contactMessage.createdAt, true)}
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        {truncate(contactMessage.message, { length: 60 })}
      </p>
    </div>
  );
}
