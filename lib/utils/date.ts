import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const format = "DD MMM YY HH:mm a";
export function formatUTCDateStringWithoutTZ(date: string): string {
  return dayjs.utc(date).local().format(format);
}

export function formatISODateString(date: string): string {
  return dayjs(date).format(format);
}

export function milisecondToHour(ms: number): number {
  return ms / (1000 * 60 * 60);
}
