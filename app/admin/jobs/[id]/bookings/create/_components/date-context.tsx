"use client";
import { milisecondToHour } from "@/lib/utils/date";
import React from "react";

type DateRangeContext = {
  state: { start?: Date; end?: Date; valid: boolean };
  setState(state: { start: Date; end: Date }): void;
};

const dateRangeContext = React.createContext<DateRangeContext>({
  state: { valid: false },
  setState: () => {},
});

export const useRDateRange = () => React.useContext(dateRangeContext).state;

export const useRWDateRange = () => React.useContext(dateRangeContext);

export const DateRangeContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = React.useState<
    Omit<DateRangeContext["state"], "valid">
  >({});
  const { start, end } = state;

  const valid = Boolean(
    start && end && milisecondToHour(end.getTime() - start.getTime()) > 0
  );

  return (
    <dateRangeContext.Provider
      value={{ state: { start, end, valid }, setState }}
    >
      {children}
    </dateRangeContext.Provider>
  );
};
