import { generateLabelsMap, generateLabelValuePairs } from "./utils";

export const APPLICATION_IMAGE_TYPE = {
  FULL_IMAGE: "full",
  HALF_IMAGE: "half",
  CLOSE_UP_IMAGE: "close_up",
  OTHER_IMAGE: "other",
} as const;

export const APPLICATION_IMAGE_TYPES = [
  APPLICATION_IMAGE_TYPE.FULL_IMAGE,
  APPLICATION_IMAGE_TYPE.HALF_IMAGE,
  APPLICATION_IMAGE_TYPE.CLOSE_UP_IMAGE,
  APPLICATION_IMAGE_TYPE.OTHER_IMAGE,
] as const;

export const APPLICATION_IMAGE_TYPE_LABELS = generateLabelsMap(
  APPLICATION_IMAGE_TYPES
);

export const APPLICATION_IMAGE_TYPE_LABLE_VALUE_PAIRS = generateLabelValuePairs(
  APPLICATION_IMAGE_TYPES
);
