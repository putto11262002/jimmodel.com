import { generateLabelsMap, generateLabelValuePairs } from "./utils";

export const APPLICATION_STATUS = {
  IN_PROGRESS: "in_progress",
  SUBMITTED: "submitted",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export const APPLICATION_STATUSES = [
  APPLICATION_STATUS.IN_PROGRESS,
  APPLICATION_STATUS.SUBMITTED,
  APPLICATION_STATUS.APPROVED,
  APPLICATION_STATUS.REJECTED,
] as const;

export const APPLICATION_STATUS_LABELS =
  generateLabelsMap(APPLICATION_STATUSES);

export const APPLICATION_STATUS_LABEL_VALUE_PAIRS =
  generateLabelValuePairs(APPLICATION_STATUSES);
