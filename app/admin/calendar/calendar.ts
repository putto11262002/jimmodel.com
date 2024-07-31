import dayjs, { Dayjs } from "dayjs";
import { BookingResolver } from "./event-resolvers/booking";
import { BlockResolver } from "./event-resolvers/model-block";

export interface Event {
  render: () => React.ReactNode;
  renderPreview: () => React.ReactNode;
  getStart: () => Date;
  getEnd: () => Date;
  getExternalPriority: () => number;
  getInteralPriority: () => number;
}

export interface EventResolver {
  resolve: (start: Date, end: Date) => Promise<Event[]>;
}

export class CalendarRenderer {
  private resolvers: EventResolver[];
  constructor(resolvers: EventResolver[]) {
    this.resolvers = resolvers;
  }

  public async render(date: string, mode: "week" | "month") {
    const [start, end] = this.getSartEnd(date, mode);
    const events = await this.resolve(start, end);
    const groupedEvents = this.groupEvenyByDate(events);

    const calendar = [];
    let current = start;
    while (current.isBefore(end)) {
      calendar.push({
        date: current.toDate(),
        events:
          groupedEvents[CalendarRenderer.getDateKey(current)]?.events ?? [],
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

  private async resolve(start: Dayjs, end: Dayjs) {
    const events = await Promise.all(
      this.resolvers.map((resolver) =>
        resolver.resolve(start.toDate(), end.toDate()),
      ),
    );
    return events.flat();
  }

  private groupEvenyByDate(events: Event[]) {
    const groupedEvents: Record<string, { date: Dayjs; events: Event[] }> = {};
    events.reduce((acc, event) => {
      const start = dayjs(event.getStart());
      const end = dayjs(event.getEnd());
      let current = start.clone();
      while (current.isBefore(end)) {
        const key = CalendarRenderer.getDateKey(current);
        if (!acc[key]) {
          acc[key] = { date: current, events: [] };
        }
        acc[key].events.push(event);
        current = current.add(1, "day");
      }
      return acc;
    }, groupedEvents);

    Object.values(groupedEvents).forEach((group) => {
      group.events.sort((a, b) => {
        const aExternal = a.getExternalPriority();
        const bExternal = b.getExternalPriority();
        if (aExternal !== bExternal) {
          return aExternal - bExternal;
        }
        const aInternal = a.getInteralPriority();
        const bInternal = b.getInteralPriority();
        return aInternal - bInternal;
      });
    });

    return groupedEvents;
  }

  static getDateKey(day: Date | Dayjs) {
    return (day instanceof Date ? dayjs(day) : day).format("YYYY-MM-DD");
  }
}

const calendarRenderer = new CalendarRenderer([
  new BookingResolver(),
  new BlockResolver(),
]);

export default calendarRenderer;
