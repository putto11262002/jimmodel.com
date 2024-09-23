import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { format } from "date-fns";

dayjs.extend(utc);
dayjs.extend(timezone);

const dateFormat = "LLL dd y";
const datetimeFormat = "LLL dd y HH:mm a";

export function milisecondToHour(ms: number): number {
  return ms / (1000 * 60 * 60);
}

export function formatDate(date: string | Date, time?: boolean): string {
  return format(date, time ? datetimeFormat : dateFormat);
}
