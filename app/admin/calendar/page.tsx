"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs, { Dayjs } from "dayjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CircleCheck, Clock } from "lucide-react";
import { CalendarRenderer } from "./calendar";
import { BookingResolver } from "./event-resolvers/booking";
import Day from "./_components/day";
import { CalendarProvider, useCalendar } from "./_components/calendar-context";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { BlockResolver } from "./event-resolvers/model-block";

export default function Page({
  searchParams,
}: {
  searchParams: { ref: string };
}) {
  const { now, key } = useCalendar();

  const calendarRenderer = new CalendarRenderer([
    new BookingResolver(),
    new BlockResolver(),
  ]);

  const { data: calendar, isSuccess } = useQuery({
    queryKey: ["calendar", key],
    queryFn: async () => {
      return calendarRenderer.render(now.toISOString(), "month");
    },
  });

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>{now.format("MMMM YYYY")}</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100vh_-_13em)]">
        <div
          style={{
            gridTemplateRows: `repeat(${isSuccess ? Math.ceil(calendar.length / 7) : 5}, minmax(0, 1fr))`,
          }}
          className="grid grid-cols-7 h-full"
        >
          {isSuccess ? (
            calendar.map((day, index) => {
              return (
                <div
                  key={index}
                  className={cn(
                    "p-2 space-y-2 overflow-hidden",
                    index % 7 !== 6 && "border-r",
                    calendar.length - 1 - index > 6 && "border-b",
                  )}
                >
                  <Day date={day.date} events={day.events} />
                </div>
              );
            })
          ) : (
            <>
              {new Array(35).fill(0).map((_, index) => (
                <div key={index} className="p-2">
                  <Skeleton className="w-full h-full" />
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
