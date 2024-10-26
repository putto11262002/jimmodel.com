import { format, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCalendarUI } from "../../context";
import { CalendarEvent } from "../../types";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import routes from "@/config/routes";

export default function EventList({
  events,
  onSelect,
  selected,
}: {
  events: CalendarEvent<string>[];
  onSelect: (index: number) => void;
  selected: number;
}) {
  const { getEventMetadataComp } = useCalendarUI();
  return (
    <ul className="flex gap-2 flex-col">
      {events.map((event, index) => {
        const time = isSameDay(event.start, event.end)
          ? `${format(event.start, "HH:mm a")} - ${format(
              event.end,
              "HH:mm a"
            )}`
          : "All day";

        const EventMetadataComp = getEventMetadataComp(event.type);
        return (
          <li
            onClick={() => onSelect(index)}
            key={index}
            className={cn(
              "border rounded-lg",
              selected === index && "ring-2 ring-primary bg-accent"
            )}
          >
            <div className="flex items-center justify-between gap-2 py-2 px-2 border-b">
              <Badge className="uppercase" variant={"secondary"}>
                {event.type}
              </Badge>
              <div className="text-xs text-muted-foreground">{time}</div>
            </div>
            <div className="px-2 py-2">
              <div className="grid gap-2">
                {EventMetadataComp && <EventMetadataComp data={event} />}
              </div>
              {EventMetadataComp && <Separator className="my-2" />}
              <ul className="flex gap-2 flex-wrap">
                {event.models.map((model, index) => (
                  <li
                    className="py-1 px-2 border rounded-lg text-sm"
                    key={index}
                  >
                    <Link
                      className="hover:underline"
                      href={routes.admin.models["[id]"].main({ id: model.id })}
                    >
                      {model.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
