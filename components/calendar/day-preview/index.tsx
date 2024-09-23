"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { createContext, useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import EventList from "./event-list";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "../types";
import EventPreview from "./event-preview";

type PreviewDay = { date: Date; events: CalendarEvent<string, any>[] };
type DayPreviewContext = {
  target: PreviewDay | null;
  preview: (newTarget: PreviewDay) => void;
  clear: () => void;
};

const dayPreviewContext = createContext<DayPreviewContext>({
  target: null,
  preview: () => {},
  clear: () => {},
});

export const useDayPreview = () => useContext(dayPreviewContext);

export default function DayPreviewProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [target, setTarget] = useState<PreviewDay | null>(null);

  return (
    <dayPreviewContext.Provider
      value={{ target, preview: setTarget, clear: () => setTarget(null) }}
    >
      <DayPreview />
      {children}
    </dayPreviewContext.Provider>
  );
}
export function DayPreview() {
  const { target, clear } = useDayPreview();

  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(-1);

  useEffect(() => {
    if (!target) {
      setSelectedEventIndex(-1);
    }
  }, [target]);

  if (!target) {
    return null;
  }
  return (
    <Sheet onOpenChange={() => clear()} open={Boolean(target)}>
      {target && (
        <SheetContent className="xl:max-w-md lg:max-w-md md:wax-w-md sm:max-w-md max-w-full w-full">
          <SheetHeader>
            <SheetTitle>{format(target.date, "dd MMM yyyy")}</SheetTitle>
          </SheetHeader>

          <div className="block overflow-x-hidden h-full">
            <div
              className={cn(
                "grid grid-cols-[100%_100%] py-4 items-stretch h-full gap-1 transition-transform delay-75 duration-300",
                selectedEventIndex === -1
                  ? "translate-x-0"
                  : "translate-x-[calc(-100%-theme(spacing.1))]"
              )}
            >
              <div className="overflow-y-auto no-scrollbar p-1">
                <EventList
                  events={target.events}
                  onSelect={setSelectedEventIndex}
                  selected={selectedEventIndex}
                />
              </div>
              <div className="flex flex-col h-full gap-2 ">
                <div>
                  <Button
                    onClick={() => setSelectedEventIndex(-1)}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronLeft className="icon-sm" />
                  </Button>
                </div>
                <div className="overflow-y-auto no-scrollbar grow rounded-lg border p-4">
                  <EventPreview
                    event={
                      selectedEventIndex !== -1
                        ? target.events[selectedEventIndex]
                        : null
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      )}
    </Sheet>
  );
}
