import {
  addDays,
  endOfMonth,
  endOfWeek,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { Booking } from "@/lib/domains";

// The generic event
export type BaseCalendarEvent<TName extends string> = {
  start: Date;
  end: Date;
  eventBadge: React.ReactNode;
  models: string[];
  type: TName;
  createdAt: string;
};

// Add other event types and function to check the type here

export type BookingCalendarEvent = BaseCalendarEvent<"booking"> & {
  jobId: string;
  status: Booking["status"];
  bookingType: Booking["type"];
};

export function isBookingEvent(
  event: CalendarEvent
): event is BookingCalendarEvent {
  return event.type === "booking";
}

export type BlockCalendarEvent = BaseCalendarEvent<"block"> & {
  id: string;
  reason: string;
};

export const isBlockEvent = (
  event: CalendarEvent
): event is BlockCalendarEvent => {
  return event.type === "block";
};

// The union of all events`
export type CalendarEvent = BookingCalendarEvent | BlockCalendarEvent;

export type CalendarType = Record<string, CalendarEvent[]>;

export const getDateKey = (date: Date) => date.toISOString();

export const getCalendarEvents = (
  start: Date,
  end: Date,
  events: CalendarEvent[][]
) => {
  const calendar: CalendarType = {};

  let current = startOfDay(start);
  while (isBefore(current, end)) {
    const currentDateEvents: CalendarType[string] = [];

    events.forEach((eventByType) => {
      eventByType.forEach((event) => {
        if (
          (isBefore(current, event.end) || isSameDay(current, event.end)) &&
          (isAfter(current, event.start) || isSameDay(current, event.start))
        ) {
          currentDateEvents.push(event);
        }
      });
    });

    // TODO: :Sort these events by types base on the soting map
    calendar[getDateKey(current)] = currentDateEvents;

    current = addDays(current, 1);
  }

  // TODO: Sort models by occurance
  return calendar;
};

export const getStartEnd = (date: Date, mode: "week" | "month") => {
  switch (mode) {
    case "week":
      return [startOfWeek(date), endOfWeek(date)] as const;
    case "month":
      return [
        startOfWeek(startOfMonth(date)),
        endOfWeek(endOfMonth(date)),
      ] as const;
  }
};
