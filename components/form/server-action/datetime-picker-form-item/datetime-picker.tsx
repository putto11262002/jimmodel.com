import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  Select,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils/date";
import {
  getHours,
  getMinutes,
  getMonth,
  getYear,
  isValid,
  setHours,
  setMinutes,
  setMonth,
  setYear,
} from "date-fns";

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
  const currentYear = new Date().getFullYear();
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
  defaultValue,
  name,
  time = true,
  onChange,
}: {
  defaultValue?: string;
  name: string;
  time?: boolean;
  onChange?: (date: Date | undefined) => void;
}) {
  const defaultDate = isValid(defaultValue)
    ? new Date(defaultValue!)
    : undefined;
  const [value, setValue] = useState<Date | undefined>(defaultDate);

  const [viewDate, setViewDate] = useState<Date>(defaultDate ?? new Date());

  useEffect(() => {
    onChange && onChange(value);
  }, [value]);

  return (
    <Popover>
      <input type="hidden" name={name} value={value?.toISOString()} />
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full pl-3 text-left font-normal bg-transparent",
            !value && "text-muted-foreground"
          )}
        >
          {value ? formatDate(value, time) : "Pick a date"}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto space-y-4">
        <div className="grid grid-cols-2 gap-x-2 gap-y-3">
          <div>
            <YearSelect
              value={viewDate}
              onChange={(newViewDate) => setViewDate(newViewDate)}
            />
          </div>
          <div>
            <MonthSelect
              value={viewDate}
              onChange={(newViewDate) => setViewDate(newViewDate)}
            />
          </div>
          {value && (
            <div className="col-span-full">
              <TimeSelect
                value={value}
                onChange={(newValue) => setValue(newValue)}
              />
            </div>
          )}
        </div>
        <Calendar
          className="p-0 w-full"
          selected={value}
          onSelect={(selected) => {
            if (!selected) {
              return;
            }
            // date.set("date", _date.getDate());
            // date.set("month", _date.getMonth());
            // date.set("year", _date.getFullYear());
            // onChange(date.toDate());
            setValue(selected);
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
  value: Date;
  onChange: (value: Date) => void;
}) {
  return (
    <div>
      <label className="text-xs font-semibold">Time</label>
      <div className="flex items-center gap-1">
        <Select
          value={value ? getHours(value).toString().padStart(2, "0") : ""}
          onValueChange={(hour) => {
            const parsedHour = parseInt(hour);
            const updatedValue = setHours(value, parsedHour);
            onChange(updatedValue);
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
          value={value ? getMinutes(value).toString().padStart(2, "0") : ""}
          onValueChange={(minute) => {
            const parsedMinute = parseInt(minute);
            const updatedValue = setMinutes(value, parsedMinute);
            onChange(updatedValue);
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
  value: Date;
  onChange: (value: Date) => void;
}) {
  return (
    <div className="">
      <label className="text-xs font-semibold">Month</label>
      <Select
        value={value ? (getMonth(value) + 1).toString().padStart(2, "0") : ""}
        onValueChange={(month) => {
          const parsedMonth = parseInt(month);
          const updatedDate = setMonth(value, parsedMonth - 1);
          onChange(updatedDate);
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
  value: Date;
  onChange: (value: Date) => void;
}) {
  return (
    <div className="">
      <label className="text-xs font-semibold">Year</label>
      <Select
        value={value ? getYear(value).toString() : ""}
        onValueChange={(year) => {
          const parsedYear = parseInt(year);
          const updatedDate = setYear(value, parsedYear);
          onChange(updatedDate);
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
