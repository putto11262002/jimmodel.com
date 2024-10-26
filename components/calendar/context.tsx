import { createContext, useContext } from "react";
import { CalendarEvent } from "./types";

export type CalendarUIContext = {
  getExtendedEventDataComp: (
    type: string
  ) =>
    | null
    | (({ data }: { data: CalendarEvent<string, any> }) => React.ReactNode);
  getEventMetadataComp: (
    type: string
  ) =>
    | (({ data }: { data: CalendarEvent<string, any> }) => React.ReactNode)
    | null;
};

export const calendarUIContext = createContext<CalendarUIContext>({
  getEventMetadataComp: () => null,
  getExtendedEventDataComp: () => null,
});

export const useCalendarUI = () => useContext(calendarUIContext);

export const CalendarUIProvider = ({
  children,
  eventMetadatComps,
  extendedEventDataComp,
}: { children: React.ReactNode } & {
  eventMetadatComps?: Partial<{
    [key: string]: ({
      data,
    }: {
      data: CalendarEvent<string, any>;
    }) => React.ReactNode;
  }>;
  extendedEventDataComp?: Partial<{
    [key: string]: ({
      data,
    }: {
      data: CalendarEvent<string, any>;
    }) => React.ReactNode;
  }>;
}) => {
  const getExtendedEventDataComp = (type: string) => {
    return extendedEventDataComp && extendedEventDataComp[type] !== undefined
      ? extendedEventDataComp[type]
      : null;
  };

  const getEventMetadataComp = (type: string) => {
    return eventMetadatComps && eventMetadatComps[type] !== undefined
      ? eventMetadatComps[type]
      : null;
  };

  return (
    <calendarUIContext.Provider
      value={{ getExtendedEventDataComp, getEventMetadataComp }}
    >
      {children}
    </calendarUIContext.Provider>
  );
};
