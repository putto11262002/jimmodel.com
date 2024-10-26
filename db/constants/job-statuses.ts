import { generateLabelsMap, generateLabelValuePairs } from "./utils";

export const JOB_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  ARCHIVED: "archived",
};
export const JOB_STATUSES = [
  JOB_STATUS.PENDING,
  JOB_STATUS.CONFIRMED,
  JOB_STATUS.CANCELLED,
  JOB_STATUS.ARCHIVED,
] as const;

export const JOB_STATUS_LABELS = generateLabelsMap(JOB_STATUSES);

export const JOB_STATUS_LABLE_VALUE_PAIRS =
  generateLabelValuePairs(JOB_STATUSES);
