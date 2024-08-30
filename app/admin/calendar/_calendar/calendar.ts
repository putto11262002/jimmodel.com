import dayjs, { Dayjs } from "dayjs";
import { BookingAdapter } from "./adapters/booking";
import { BlockAdapter } from "./adapters/model-block";

export interface Event {
  render: () => React.ReactNode;
  renderPreview: () => React.ReactNode;
  getStart: () => Date;
  getEnd: () => Date;
  getExternalPriority: () => number;
  getInteralPriority: () => number;
}
type DateKey = string;

export type GroupedEvents = Record<DateKey, Event[]>;

export interface EventStragety {
  get: (start: Date, end: Date) => Promise<GroupedEvents>;
}

export class Calendar {
  private resolvers: EventStragety[];
  constructor(adapters: EventStragety[]) {
    this.resolvers = adapters;
  }

  public async getCalendar(date: string, mode: "week" | "month") {
    const [start, end] = this.getSartEnd(date, mode);
    const groupedEvents = await this.getEvents(start, end);
    // const groupedEvents = this.groupEvenyByDate();

    const calendar = [];
    let current = start;
    while (current.isBefore(end)) {
      const events = groupedEvents
        .map((group) => group[Calendar.getDateKey(current)] || [])
        .flat();
      const sortedEvents = events.flat().sort((a, b) => {
        const aExternal = a.getExternalPriority();
        const bExternal = b.getExternalPriority();
        if (aExternal !== bExternal) {
          return aExternal - bExternal;
        }
        const aInternal = a.getInteralPriority();
        const bInternal = b.getInteralPriority();
        return aInternal - bInternal;
      });

      calendar.push({
        date: current.toDate(),
        events: sortedEvents,
      });
      current = current.add(1, "day");
    }

    return calendar;
  }
  public placeholder(date: string, mode: "week" | "month") {
    const [start, end] = this.getSartEnd(date, mode);
    const calendar = [];
    let current = start;
    while (current.isBefore(end)) {
      calendar.push({
        date: current.toDate(),
        events: [],
      });
      current = current.add(1, "day");
    }
    return calendar;
  }

  private getSartEnd(date: string, mode: "week" | "month") {
    switch (mode) {
      case "week":
        return [
          dayjs(date).startOf("week"),
          dayjs(date).endOf("week"),
        ] as const;
      case "month":
        return [
          dayjs(date).startOf("month").startOf("week"),
          dayjs(date).endOf("month").endOf("week"),
        ] as const;
    }
  }

  private async getEvents(start: Dayjs, end: Dayjs) {
    const events = await Promise.all(
      this.resolvers.map((resolver) =>
        resolver.get(start.toDate(), end.toDate()),
      ),
    );
    return events;
  }

  static getDateKey(day: Date | Dayjs) {
    return (day instanceof Date ? dayjs(day) : day).format("YYYY-MM-DD");
  }
}

const calendar = new Calendar([new BlockAdapter(), new BookingAdapter()]);

export default calendar;
