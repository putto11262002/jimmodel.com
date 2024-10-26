import dayjs, { Dayjs } from "dayjs";
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
import {
  CalendarEvent,
  CalendarType,
  ExtractEvent,
  ExtractEventType,
} from "./types";

export const getDateKey = (date: Date) => date.toISOString();

export const getCalendar = <T extends CalendarEvent<string>>(
  start: Date,
  end: Date,
  events: T[]
): CalendarType<T> => {
  const calendar: CalendarType<T> = {};

  let current = startOfDay(start);
  while (isBefore(current, end)) {
    const currentDateEvents: T[] = [];

    events.forEach((event) => {
      if (
        (isBefore(current, event.end) || isSameDay(current, event.end)) &&
        (isAfter(current, event.start) || isSameDay(current, event.start))
      ) {
        currentDateEvents.push(event);
      }
    });

    calendar[getDateKey(current)] = currentDateEvents;

    current = addDays(current, 1);
  }

  return calendar;
};

export const sortEvents = <T extends CalendarEvent<string>>(
  calendar: CalendarType<T>,
  {
    sortKeyByType = {},
    eventTypePriority = {},
  }: {
    sortKeyByType?: {
      [eventType in ExtractEventType<T>]?: keyof Extract<
        T,
        { type: eventType }
      >;
    };
    eventTypePriority?: {
      [eventType in ExtractEventType<T>]?: number;
    };
  } = {}
) => {
  Object.entries(calendar).forEach(([key, events]) => {
    events.sort((a, b) => {
      const aPriority = (eventTypePriority as any)[a.type] ?? 0;
      const bPriority = (eventTypePriority as any)[b.type] ?? 0;

      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      const aSortKey = (sortKeyByType as any)[a.type];
      const bSortKey = (sortKeyByType as any)[b.type];

      if (aSortKey && bSortKey) {
        const aValue = (a as any)[aSortKey];
        const bValue = (b as any)[bSortKey];

        if (aValue !== undefined && bValue !== undefined) {
          return bValue - aValue;
        }
      }

      return 0; // No sorting if no priority or sort key is provided
    });
  });
};

/**
 * Sorts the models in each event of the calendar based on how frequently
 * they appear across all events on the same date.
 *
 * @param calendar - A CalendarType object where each key is a date and the
 * value is an array of events for that date.
 *
 * The function performs the following steps:
 * 1. Iterates over each date and the associated events in the calendar.
 * 2. Counts how many times each model appears in all events for that date.
 * 3. Sorts the models within each event by their appearance frequency
 *    (descending order), so that models appearing more frequently are listed first.
 */
export const sortEventModels = (
  calendar: CalendarType<CalendarEvent<string>>
) => {
  Object.entries(calendar).forEach(([key, events]) => {
    const modelCount = new Map<string, number>();
    events.forEach((event) => {
      event.models.forEach((model) => {
        modelCount.set(model.id, (modelCount.get(model.id) ?? 0) + 1);
      });
    });
    events.forEach((event) => {
      event.models.sort((a, b) => {
        return (modelCount.get(b.id) ?? 0) - (modelCount.get(a.id) ?? 0);
      });
    });
  });
};

export const getPlaceholderCalendar = (start: Date, end: Date) => {
  const calendar: CalendarType<CalendarEvent<string>> = {};
  let current = startOfDay(start);
  while (isBefore(current, end)) {
    calendar[getDateKey(current)] = [];
    current = addDays(current, 1);
  }
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
