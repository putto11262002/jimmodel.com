import { useMemo, useState } from "react";
import {
  CalendarEvent,
  CalendarMode,
  CalendarType,
  EventLoader,
  ExtractEventFromLoader,
  ExtractEventType,
  ExtractEventTypeFromLoader,
} from "./types";
import { addMonths, addWeeks, startOfDay, subMonths, subWeeks } from "date-fns";
import useSWR from "swr";
import {
  getCalendar,
  getPlaceholderCalendar,
  getStartEnd,
  sortEventModels,
  sortEvents,
} from "./utils";

export interface UseCalendarProps<TLoaders extends EventLoader[]> {
  loaders: TLoaders;
  eventTypePriority?: {
    [key in ExtractEventTypeFromLoader<TLoaders[number]>]?: number;
  };

  sortKeyByType?: {
    [key in ExtractEventTypeFromLoader<TLoaders[number]>]?: keyof Extract<
      ExtractEventFromLoader<TLoaders[number]>,
      { type: key }
    >;
  };
}

export type UseCalendarBaseReturnType = {
  mode: CalendarMode;
  ref: Date;
  next: () => void;
  previous: () => void;
  today: () => void;
  setMode: (mode: CalendarMode) => void;
  start: Date;
  end: Date;
};

export type UseCaseCalendarSuccessReturnType<TLoaders extends EventLoader[]> = {
  calendar: CalendarType<ExtractEventFromLoader<TLoaders[number]>>;
  status: "success";
  error: null;
} & UseCalendarBaseReturnType;

export type UseCaseCalendarLoadingReturnType = {
  status: "loading";
  calendar: CalendarType<CalendarEvent<string>>;
  error: null;
} & UseCalendarBaseReturnType;

export type UseCaseCalendarErrorReturnType = {
  status: "error";
  calendar: undefined;
  error: Error;
} & UseCalendarBaseReturnType;

export type CalendarLoaderReturnType<TEventTypes extends EventLoader[]> =
  | UseCaseCalendarSuccessReturnType<TEventTypes>
  | UseCaseCalendarLoadingReturnType
  | UseCaseCalendarErrorReturnType;

export default function UseCalendar<TLoaders extends EventLoader[]>({
  loaders,
  sortKeyByType,
  eventTypePriority,
}: UseCalendarProps<TLoaders>): CalendarLoaderReturnType<TLoaders> {
  const [ref, setRef] = useState(startOfDay(new Date()));
  const [mode, setMode] = useState<CalendarMode>("month");
  const [start, end] = useMemo(() => getStartEnd(ref, mode), [ref, mode]);

  const { data, isLoading, error } = useSWR(
    { start, end },
    async ({ start, end }) => {
      const startStr = start.toISOString();
      const endStr = end.toISOString();
      const events = await Promise.all(
        loaders.map((loader) => loader({ start: startStr, end: endStr }))
      );
      return events.flat();
    }
  );

  const calendar = useMemo(() => {
    if (!data) return undefined;
    const calendar = getCalendar(start, end, data);
    sortEvents(calendar, { sortKeyByType, eventTypePriority });
    sortEventModels(calendar);
    return calendar;
  }, [data]);

  const next = () => {
    if (mode === "week") {
      return setRef((prev) => addWeeks(prev, 1));
    }

    if (mode === "month") {
      return setRef((prev) => addMonths(prev, 1));
    }
  };

  const previous = () => {
    if (mode === "week") {
      return setRef((prev) => subWeeks(prev, 1));
    }
    if (mode === "month") {
      return setRef((prev) => subMonths(prev, 1));
    }
  };

  const today = () => {
    setRef(startOfDay(new Date()));
  };

  const baseReturn = {
    mode,
    setMode,
    ref,
    next,
    previous,
    today,
    start,
    end,
  };

  if (error) {
    return { ...baseReturn, status: "error", calendar: undefined, error };
  }

  if (isLoading || !calendar) {
    return {
      ...baseReturn,
      status: "loading",
      calendar: getPlaceholderCalendar(start, end),
      error: null,
    };
  }

  return { ...baseReturn, status: "success", calendar, error: null };
}
