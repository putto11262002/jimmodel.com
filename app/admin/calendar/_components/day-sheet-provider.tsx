"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CalendarProvider, useCalendar } from "./calendar-context";
import dayjs from "dayjs";

export default function DaySheetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CalendarProvider>{children}</CalendarProvider>;
}

export function SheetProvider() {
  const { focus: state, clear } = useCalendar();

  return (
    <>
      <Sheet open={Boolean(state)} onOpenChange={(open) => !open && clear()}>
        {state && (
          <SheetContent className="overflow-y-auto w-full md:w-3/4">
            <SheetHeader>
              <SheetTitle className="text-left">
                {dayjs(state.date).format("DD MMM YYYY")}
              </SheetTitle>
            </SheetHeader>
            <div className="py-4 grid gap-4">
              {state.events.length > 0 ? (
                state.events.map((event, index) => (
                  <div key={index} className="rounded shadow p-3 px-4">
                    {event.render()}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No Events</p>
              )}
            </div>
          </SheetContent>
        )}
      </Sheet>
    </>
  );
}
