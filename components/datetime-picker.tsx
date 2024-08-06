import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import dayjs from "dayjs";
import { Calendar } from "@/components/ui/calendar";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  Select,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

function getHourList() {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    // Pad the hour string with a leading zero if necessary
    hours.push(i.toString().padStart(2, "0"));
  }
  return hours;
}

function getMinuteList() {
  const minutes = [];
  for (let i = 0; i < 60; i++) {
    // Pad the minute string with a leading zero if necessary
    minutes.push(i.toString().padStart(2, "0"));
  }
  return minutes;
}

function getYearList() {
  const years = [];
  const currentYear = dayjs().year();
  for (let i = currentYear; i >= currentYear - 100; i--) {
    years.push(i);
  }
  return years;
}

const minutes = getMinuteList();
const hours = getHourList();
const months = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];
const years = getYearList();

export default function DatetimePicker({
  value,
  onChange,
}: {
  value?: Date;
  onChange: (value: Date) => void;
}) {
  const [viewDate, setViewDate] = useState(new Date());
  useEffect(() => {
    setViewDate(value ?? new Date());
  }, [value]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full pl-3 text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          {value ? (
            dayjs(value).format("DD MMM YYYY HH:mm")
          ) : (
            <span>Pick a date</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto space-y-4">
        <div className="grid grid-cols-2 gap-x-2 gap-y-3">
          <div>
            <YearSelect value={value} onChange={onChange} />
          </div>
          <div>
            <MonthSelect value={value} onChange={onChange} />
          </div>
          <div className="col-span-full">
            <TimeSelect value={value} onChange={onChange} />
          </div>
        </div>
        <Calendar
          className="p-0 w-full"
          selected={value ?? undefined}
          onSelect={(_date) => {
            if (!_date) {
              return;
            }
            const date = dayjs(_date);
            date.set("date", _date.getDate());
            date.set("month", _date.getMonth());
            date.set("year", _date.getFullYear());
            onChange(date.toDate());
          }}
          onMonthChange={(date) => setViewDate(date)}
          month={viewDate}
          initialFocus
          mode="single"
        />
      </PopoverContent>
    </Popover>
  );
}
function TimeSelect({
  value,
  onChange,
}: {
  value: Date | undefined | null;
  onChange: (value: Date) => void;
}) {
  return (
    <div>
      <label className="text-xs font-semibold">Time</label>
      <div className="flex items-center gap-1">
        <Select
          value={value ? dayjs(value).hour().toString().padStart(2, "0") : ""}
          onValueChange={(hour) => {
            const parsedHour = parseInt(hour);
            let date = dayjs(value);
            date = date.set("hour", parsedHour);
            onChange(date.toDate());
          }}
        >
          <SelectTrigger className="">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="">
            {hours.map((i) => (
              <SelectItem key={i} value={i}>
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>:</span>
        <Select
          value={value ? dayjs(value).minute().toString().padStart(2, "0") : ""}
          onValueChange={(minute) => {
            const parsedMinute = parseInt(minute);
            let date = dayjs(value);
            date = date.set("minute", parsedMinute);
            onChange(date.toDate());
          }}
        >
          <SelectTrigger className="">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="">
            {minutes.map((i) => (
              <SelectItem key={i} value={i}>
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
function MonthSelect({
  value,
  onChange,
}: {
  value: Date | undefined | null;
  onChange: (value: Date) => void;
}) {
  return (
    <div className="">
      <label className="text-xs font-semibold">Month</label>
      <Select
        value={value ? (dayjs(value).month() + 1).toString() : ""}
        onValueChange={(month) => {
          const parsedMonth = parseInt(month);
          let date = dayjs(value);
          date = date.set("month", parsedMonth - 1);
          onChange(date.toDate());
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {months.map(({ value, label }, i) => (
            <SelectItem key={i} value={value.toString()}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function YearSelect({
  value,
  onChange,
}: {
  value: Date | undefined | null;
  onChange: (value: Date) => void;
}) {
  return (
    <div className="">
      <label className="text-xs font-semibold">Year</label>
      <Select
        value={value ? value.getFullYear().toString() : ""}
        onValueChange={(year) => {
          const parsedYear = parseInt(year);
          let date = dayjs(value);
          date = date.set("year", parsedYear);
          onChange(date.toDate());
        }}
      >
        <SelectTrigger className="">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((year, i) => (
            <SelectItem key={i} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
