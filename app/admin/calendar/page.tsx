"use client";
import { cn } from "@/lib/utils";
import { useCalendar } from "./_components/calendar-context";
import React, { useEffect, useState } from "react";

export default function Page() {
  const {
    calendar: { data, isLoading },
    view,
  } = useCalendar();
  const [eventsLimit, setEventsLimit] = useState(0);

  const cellRef = React.useRef<HTMLUListElement>(null);

  const calculateLimit = () => {
    if (cellRef.current) {
      setEventsLimit(() =>
        Math.floor((cellRef.current!.clientHeight! - 20) / 20),
      );
    }
  };

  useEffect(() => {
    calculateLimit();
  }, [isLoading, data]);

  useEffect(() => {
    const handleResize = () => {
      calculateLimit();
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [calculateLimit]);

  return (
    <div
      style={{
        gridTemplateRows: `repeat(${Math.ceil(data.length / 7)}, minmax(0, 1fr))`,
      }}
      className="grid grid-cols-7 h-full"
    >
      {data.map((day, index) => {
        return (
          <div
            id={index.toString()}
            onClick={() => view(day)}
            key={index}
            className={cn(
              "overflow-hidden space-y-1 flex flex-col ",
              index % 7 !== 6 && "border-r",
              data.length - 1 - index > 6 && "border-b",
            )}
          >
            <div className="text-xs text-muted-foreground text-center p-0.5">
              {day.date.getDate()}
            </div>
            <ul
              ref={index === 0 ? cellRef : undefined}
              className="space-y-0.5 overflow-hidden grow"
            >
              {isLoading
                ? new Array(2).fill(0, 0, 2).map((_, idx) => (
                    <li
                      className="rounded bg-muted py-[1px] px-1 overflow-hidden h-[18px]"
                      key={idx}
                    >
                      <p className="text-[10px] text-transparent">Event</p>
                    </li>
                  ))
                : day.events.slice(0, eventsLimit).map((event, idx) => (
                    <li
                      className="rounded bg-muted py-[1px] px-1 overflow-hidden h-[18px]"
                      key={idx}
                    >
                      {!isLoading && event.renderPreview()}
                    </li>
                  ))}
              {day.events.length > eventsLimit && (
                <li className="text-[10px] px-1 text-muted-foreground text-nowrap">
                  {day.events.length - eventsLimit} more...
                </li>
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
