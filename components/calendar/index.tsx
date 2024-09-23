import GridCalendar from "./calendar-grid";
import {
  EventLoader,
  ExtractEventFromLoader,
  ExtractEventTypeFromLoader,
} from "./types";
import useCalendar, { UseCalendarProps } from "./use-calendar";
import Alert from "../alert";
import { CalendarUIProvider } from "./context";
import DayPreviewProvider from "./day-preview";
import { Skeleton } from "../ui/skeleton";
import DefaultControl from "./default-control";

export type CalendarProps<TLoaders extends EventLoader[]> =
  UseCalendarProps<TLoaders> & {
    eventCardMetadata?: {
      [key in ExtractEventTypeFromLoader<TLoaders[number]>]?: ({
        data,
      }: {
        data: Extract<ExtractEventFromLoader<TLoaders[number]>, { type: key }>; // Get the return type of the function
      }) => React.ReactNode;
    };
    extendedEventDataComp?: {
      [key in ExtractEventTypeFromLoader<TLoaders[number]>]?: ({
        data,
      }: {
        data: Extract<ExtractEventFromLoader<TLoaders[number]>, { type: key }>; // Get the return type of the function
      }) => React.ReactNode;
    };
  };

function _Calendar<TLoaders extends EventLoader[]>(
  props: CalendarProps<TLoaders>
) {
  const { status, calendar, error, ...rest } = useCalendar({ ...props });
  if (status === "error") {
    return (
      <div>
        <Alert variant="error">{error.message}</Alert>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col">
      <div>
        <DefaultControl {...rest} />
      </div>
      <div className="grow">
        {status === "loading" ? (
          <div className="grow grid grid-cols-7 w-full h-full p-2 gap-2 grid-rows-5">
            {new Array(35).fill(0).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-1/4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <GridCalendar calendar={calendar} />
        )}
      </div>
    </div>
  );
}

export default function Calendar<TEventTypes extends EventLoader[]>(
  props: CalendarProps<TEventTypes>
) {
  return (
    <CalendarUIProvider
      eventMetadatComps={props.eventCardMetadata}
      extendedEventDataComp={props.extendedEventDataComp}
    >
      <DayPreviewProvider>
        <_Calendar {...props} />
      </DayPreviewProvider>
    </CalendarUIProvider>
  );
}
