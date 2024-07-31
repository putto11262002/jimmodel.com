"use client";
import { cn } from "@/lib/utils";
import { Event } from "../calendar";
import { useCalendar } from "./calendar-context";
import resolveConfig from "tailwindcss/resolveConfig";
import _tailwindConfig from "@/tailwind.config";
import { useEffect, useRef } from "react";

const tailwindConfig = resolveConfig(_tailwindConfig);

export default function Day({ date, events , parentId}: { date: Date; events: Event[], parentId: string}) {
  const { view } = useCalendar();
  const containerRef = useRef<HTMLDivElement>(null)
  let limit = 2;
  if (document.documentElement.clientHeight >= 700) {
    limit = 3;
  }
  if (document.documentElement.clientHeight >= 1000) {
    limit = 8;
  }

  const hasMore = events.length > limit;
  const extras = events.length - limit;
  return (
    <div
    ref={containerRef}
      onClick={() => view({ date, events })}
      className={cn(
        "p-2 pb-0 space-y-2 overflow-hidden cursor-pointer w-full h-full",
      )}
    >
      <div className="text-xs text-muted-foreground text-center ">
        {date.getDate()}
      </div>
      <ul className="space-y-0.5 overflow-hidden">
        {events?.slice(0, limit).map((event, index) => (
          <li
            className="rounded bg-muted py-[1px] px-1 overflow-hidden"
            key={index}
          >
            {event.renderPreview()}
          </li>
        ))}
        {hasMore && (
          <li className="px-1 overflow-hidden text-[10px]">{extras} more...</li>
        )}
      </ul>
    </div>
  );
}
