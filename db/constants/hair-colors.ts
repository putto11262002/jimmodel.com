import { generateLabelsMap, generateLabelValuePairs } from "./utils";

export const HAIR_COLORS = [
  "blonde",
  "brunette",
  "black",
  "red",
  "brown",
  "gray",
  "silver",
  "auburn",
  "other",
] as const;

export const HAIR_COLOR_LABELS = generateLabelsMap(HAIR_COLORS);

export const HAIR_COLOR_LABEL_VALUE_PAIRS =
  generateLabelValuePairs(HAIR_COLORS);
