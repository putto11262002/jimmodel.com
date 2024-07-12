"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { Event } from "../calendar";
import dayjs, {Dayjs} from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear"
dayjs.extend(weekOfYear);

 

type CalendarContext = {
  mode: "week" | "month",
  now: Dayjs,
 focus:  {date: Date, events: Event[]} | null,
  view: (args: {date: Date, events: Event[]}) => void
  clear: () => void
  next: () => void
  prev: () => void
  cur: () => void
  key: string
}

export const calendarContext = createContext<CalendarContext>({
  focus: null,
  view: () => {},
  clear: () => {},
  mode: "month",
  now: dayjs(),
  next: () => {},
  prev: () => {},
  cur: () => {},
  key: ""
});

export const useCalendar = () => useContext(calendarContext);

export const CalendarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, _setState] = useState<CalendarContext['focus']>(null);

  const [mode, setMode] = useState<"week" | "month">("month")

  const [now, setNow] = useState(dayjs())

  const [key, setKey] = useState("")

  const view = ({date, events}: {date: Date, events: Event[]}) => {
    _setState({date, events});
  }

  const clear  = () => {
    _setState(null)
  }

  const next = ( ) => {
    setNow((now) => now.add(1, mode))

  }

  const prev = () => {
    setNow((now) => now.subtract(1, mode))
  }

  const cur = () => {
    setNow(dayjs())
  }

  const getKey = ( ) => {
    switch (mode) {
      case "month":
        return now.format("YYYY-MM")
      case "week":
        return `${now.format("YYYY-MM")}-${now.week()}`
    }
  }

  useEffect(() => {
    setKey(getKey())
  }, [now, mode])



  return (
    <calendarContext.Provider
      value={{ focus: state, view , clear, mode, now, next, prev, key, cur}}
    >
      {children}
    </calendarContext.Provider>
  );
};
