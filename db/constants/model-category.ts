import { generateLabelsMap, generateLabelValuePairs } from "./utils";

export const MODEL_CATEGORY = {
  MALE: "male",
  FEMALE: "female",
  NON_BINARY: "non-binary",
  KIDS: "kids",
  SENIORS: "seniors",
} as const;

export const MODEL_CATEGORIES = [
  MODEL_CATEGORY.MALE,
  MODEL_CATEGORY.FEMALE,
  MODEL_CATEGORY.NON_BINARY,
  MODEL_CATEGORY.KIDS,
  MODEL_CATEGORY.SENIORS,
] as const;

export const MODEL_CATEGORY_LABELS = generateLabelsMap(MODEL_CATEGORIES);

export const MODEL_CATEGORY_LABEL_VALUE_PAIRS =
  generateLabelValuePairs(MODEL_CATEGORIES);

