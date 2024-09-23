"use client";

import React, { useEffect } from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAutoForm } from "@/components/shared/auto-form";
import { Calendar as CalendarIcon } from "lucide-react";
import { formatDate } from "@/lib/utils/date";
import { BoxSize } from "@/components/shared/types/box";
import FormItem from "../../form-item";
import FormMessage from "../../form-message";
import { Label } from "@/components/ui/label";

export default function DateRangePicker({
  className,
  startName,
  endName,
  defaultValue,
  time = false,
  size,
  label,
}: Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  startName: string;
  endName: string;
  defaultValue?: DateRange;
  time?: boolean;
  size?: BoxSize;
  label?: string;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>(defaultValue);

  const { onChange } = useAutoForm();

  useEffect(() => {
    if (date?.to === defaultValue?.to && date?.from === defaultValue?.from)
      return;
    onChange();
  }, [date]);

  return (
    <FormItem size={size}>
      {label && <Label size={size}>{label}</Label>}
      <input
        id="start"
        type="hidden"
        name={startName}
        value={date?.from ? date?.from.toISOString() : ""}
      />
      <input
        id="end"
        type="hidden"
        name={endName}
        value={date?.to ? date?.to.toISOString() : ""}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size={size}
            id="date"
            variant={"outline"}
            className={cn(
              "w-full flex justify-start text-left font-normal gap-2 items-center",
              !date && "text-muted-foreground",
              className
            )}
          >
            {date?.from ? (
              date.to ? (
                <>
                  {formatDate(date.from, time)} - {formatDate(date.to, time)}
                </>
              ) : (
                formatDate(date.from, time)
              )
            ) : (
              <span>Pick a date range</span>
            )}

            <CalendarIcon className="icon-sm ml-auto " />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <div className="pb-3 px-3">
            <Button
              onClick={() => setDate(undefined)}
              className="w-full h-8"
              variant="outline"
              size="default"
              type="button"
            >
              Clear Selection
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}
