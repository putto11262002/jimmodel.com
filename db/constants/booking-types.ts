import { generateLabelsMap, generateLabelValuePairs } from "./utils";

export const BOOKING_TYPE = {
  FITTING: "fitting",
  SHOOTING: "shooting",
  MEETING: "meeting",
  REHEARSAL: "rehearsal",
  OTHER: "other",
} as const;

export const BOOKING_TYPES = [
  BOOKING_TYPE.FITTING,
  BOOKING_TYPE.SHOOTING,
  BOOKING_TYPE.MEETING,
  BOOKING_TYPE.OTHER,
] as const;

export const BOOKING_TYPE_LABELS = generateLabelsMap(BOOKING_TYPES);

export const BOOKING_TYPE_LABEL_VALUE_PAIRS =
  generateLabelValuePairs(BOOKING_TYPES);
