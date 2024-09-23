import { generateLabelsMap, generateLabelValuePairs } from "./utils";

export const BOOKING_STATUS = {
  LOCAL: "local",
  IN_TOWN: "in_town",
  DIRECT_BOOKING: "direct_booking",
} as const;

export const BOOKING_STATUSES = [
  BOOKING_STATUS.LOCAL,
  BOOKING_STATUS.IN_TOWN,
  BOOKING_STATUS.DIRECT_BOOKING,
] as const;

export const BOOKING_STATUS_LABELS = generateLabelsMap(BOOKING_STATUSES);

export const BOOKING_STATUS_LABEL_VALUE_PAIRS =
  generateLabelValuePairs(BOOKING_STATUSES);
