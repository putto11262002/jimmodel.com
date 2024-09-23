"use client";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { CalendarEvent, CalendarType } from "./types";
import { useDayPreview } from "./day-preview";
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export default function GridCalendar<
  T extends CalendarType<CalendarEvent<string>>
>({ calendar }: { calendar: T }) {
  const [eventsLimit, setEventsLimit] = useState(0);

  const cellRef = useRef<HTMLUListElement>(null);

  const calculateLimit = () => {
    if (cellRef.current) {
      setEventsLimit(() =>
        Math.floor((cellRef.current!.clientHeight! - 20) / 20)
      );
    }
  };

  useEffect(() => {
    calculateLimit();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      calculateLimit();
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [calculateLimit]);

  const calendarEntries = Object.entries(calendar);
  const { preview } = useDayPreview();

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-7">
        {WEEK_DAYS.map((day, index) => (
          <div
            className="text-xs font-medium text-muted-foreground border-r last:border-r-0 text-center pt-[2px]"
            key={index}
          >
            {day}
          </div>
        ))}
      </div>
      <div
        style={{
          gridTemplateRows: `repeat(${Math.ceil(
            calendarEntries.length / 7
          )}, minmax(0, 1fr))`,
        }}
        className="grid grid-cols-7 grow"
      >
        {calendarEntries.map(([key, events], index) => {
          return (
            <div
              id={index.toString()}
              onClick={() => preview({ date: new Date(key), events: events })}
              key={index}
              className={cn(
                "overflow-hidden space-y-1 flex flex-col ",
                index % 7 !== 6 && "border-r",
                calendarEntries.length - 1 - index > 6 && "border-b"
              )}
            >
              <div className="text-xs text-muted-foreground text-center p-0.5">
                {dayjs(key).date()}
              </div>
              <ul
                ref={index === 0 ? cellRef : undefined}
                className="space-y-0.5 overflow-hidden grow"
              >
                {events.slice(0, eventsLimit).map((event, idx) => (
                  <li
                    className="rounded bg-muted py-[1px] px-1 overflow-hidden h-[18px] flex gap-1 items-center"
                    key={idx}
                  >
                    {event.icon}
                    <p className="text-[10px] font-medium overflow-ellipsis text-nowrap">
                      {event.models.map((model) => model.name).join(", ")}
                    </p>
                  </li>
                ))}
                {events.length > eventsLimit && (
                  <li className="text-[12px] px-1 text-muted-foreground text-nowrap">
                    {events.length - eventsLimit} more...
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
