import { generateLabelsMap, generateLabelValuePairs } from "./utils";

export const MODEL_IMAGE_TYPE = {
  BOOK: "book",
  POLAROID: "polaroid",
  COMPOSITE: "composite",
  APPLICATION: "application",
  OTHER: "other",
} as const;

export const MODEL_IMAGE_TYPES = [
  MODEL_IMAGE_TYPE.BOOK,
  MODEL_IMAGE_TYPE.POLAROID,
  MODEL_IMAGE_TYPE.COMPOSITE,
  MODEL_IMAGE_TYPE.APPLICATION,
  MODEL_IMAGE_TYPE.OTHER,
] as const;

export const MODEL_IMAGE_TYPE_LABELS = generateLabelsMap(MODEL_IMAGE_TYPES);

export const MODEL_IMAGE_TYPE_LABEL_VALUE_PAIRS =
  generateLabelValuePairs(MODEL_IMAGE_TYPES);
