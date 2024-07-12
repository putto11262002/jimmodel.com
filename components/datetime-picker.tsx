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

const minutes = getMinuteList();
const hours = getHourList();

export default function DatetimePicker({
  value,
  onChange,
}: {
  value?: Date | null | undefined;
  onChange: (value: Date | undefined) => void;
}) {
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
            dayjs(value).format("DD/MM/YYYY HH:mm")
          ) : (
            <span>Pick a date</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold">Time</label>
          <div className="flex items-center gap-3">
            <Select
              defaultValue={
                value ? dayjs(value).hour().toString().padStart(2, "0") : ""
              }
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
              <SelectContent className="max-h-36">
                {hours.map((i) => (
                  <SelectItem key={i} value={i}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>:</span>
            <Select
              defaultValue={
                value ? dayjs(value).minute().toString().padStart(2, "0") : ""
              }
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
              <SelectContent className="max-h-36">
                {minutes.map((i) => (
                  <SelectItem key={i} value={i}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          initialFocus
          mode="single"
        />
      </PopoverContent>
    </Popover>
  );
}
