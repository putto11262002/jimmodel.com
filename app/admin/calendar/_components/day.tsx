"use client"
import { cn } from "@/lib/utils";
import { Event } from "../calendar";
import { useCalendar } from "./calendar-context";

export default function Day({ date, events }: { date: Date; events: Event[] }) {
const {view} = useCalendar()
  return (
    <div onClick={() => view({date, events})} className={cn("p-2 space-y-2 overflow-hidden cursor-pointer w-full h-full")}>
      <div className="text-xs text-muted-foreground text-center ">
        {date.getDate()}
      </div>
      <ul className="space-y-1 overflow-hidden">
        {events?.map((event, index) => (
          <li
            className="rounded bg-muted py-0.5 px-1 overflow-hidden"
            key={index}
          >
            {event.renderPreview()}
          </li>
        ))}
      </ul>
    </div>
  );
}
