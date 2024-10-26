/**
 * Base event type with start/end times, associated models, event type, and optional icon.
 *
 * @template TName - The name/type of the calendar event as a string.
 */
export type BaseCalendarEvent<TName extends Readonly<string>> = {
  start: Date;
  end: Date;
  models: { id: string; name: string }[];
  type: TName;
  icon?: React.ReactNode;
};

/**
 * Calendar event type that supports additional data for specific event types.
 *
 * @template TName - The name/type of the calendar event as a string.
 * @template TData - Additional data that may vary depending on the event type (optional).
 */
export type CalendarEvent<
  TName extends Readonly<string>,
  TData extends Record<string, any> | undefined = undefined
> = TData extends undefined
  ? BaseCalendarEvent<TName>
  : BaseCalendarEvent<TName> & TData;

/**
 * Type for a calendar that organizes events by event type.
 *
 * @template TEvents - The type of the calendar event.
 */
export type CalendarType<TEvents extends CalendarEvent<any>> = Record<
  string,
  TEvents[]
>;

/**
 * Supported calendar display modes (either week or month).
 */
export type CalendarMode = "week" | "month";

/**
 * Function type for loading events within a specific date range.
 *
 * @param start - The start date of the range (ISO string).
 * @param end - The end date of the range (ISO string).
 * @returns A promise resolving to an array of CalendarEvent objects.
 */
export type EventLoader = ({
  start,
  end,
}: {
  start: string;
  end: string;
}) => Promise<CalendarEvent<string>[]>;

/**
 * Utility type to extract the event type (TName) from a CalendarEvent.
 *
 * @template T - The CalendarEvent from which to extract the event type.
 * @returns The name/type of the calendar event.
 */
export type ExtractEventType<T> = T extends CalendarEvent<infer TName>
  ? TName
  : never;

/**
 * Utility type to extract the event object from a CalendarType.
 *
 * @template T - The CalendarType from which to extract the event.
 * @returns The event object.
 */
export type ExtractEvent<T> = T extends CalendarType<infer TEvents>
  ? TEvents
  : never;

/**
 * Extract the event type (TName) from the return value of an EventLoader.
 *
 * @template T - The EventLoader from which to extract the event type.
 * @returns The name/type of the event from the EventLoader result.
 */
export type ExtractEventTypeFromLoader<T extends EventLoader> =
  ExtractEventType<Awaited<ReturnType<T>>[number]>;

/**
 * Extract the event object from the return value of an EventLoader.
 *
 * @template T - The EventLoader from which to extract the event.
 * @returns The event object from the EventLoader result.
 */
export type ExtractEventFromLoader<T extends EventLoader> = Awaited<
  ReturnType<T>
>[number];

/**
 * Type enforcement to ensure a value is sortable (e.g., string, number, boolean, etc.).
 *
 * @template T - The type to check for sortability.
 * @returns T if the value is sortable or has a toString method, otherwise never.
 */
export type EnforceSortable<T> = T extends
  | string
  | number
  | boolean
  | null
  | undefined
  ? T
  : T extends { toString(): string }
  ? T
  : never;
