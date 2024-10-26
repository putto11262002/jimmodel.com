import { CalendarEvent } from "../../types";
import { useCalendarUI } from "../../context";
const EventPreview = ({ event }: { event: CalendarEvent<string> | null }) => {
  const { getExtendedEventDataComp } = useCalendarUI();
  if (!event) {
    return null;
  }
  const ExtendedEventDataComp = getExtendedEventDataComp(event.type);

  return ExtendedEventDataComp ? (
    <ExtendedEventDataComp data={event} />
  ) : (
    <div className="flex justify-center items-center text-muted-foreground h-full text-sm">
      No more info
    </div>
  );
};

export default EventPreview;
