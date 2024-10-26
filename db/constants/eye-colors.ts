import { generateLabelsMap, generateLabelValuePairs } from "./utils";

export const EYE_COLOR = {
  BROWN: "brown",
  BLUE: "blue",
  GREEN: "green",
  HAZEL: "hazel",
  GRAY: "gray",
  BLACK: "black",
  AMBER: "amber",
  VIOLET: "violet",
  RED: "red",
};
export const EYE_COLORS = [
  EYE_COLOR.BROWN,
  EYE_COLOR.BLUE,
  EYE_COLOR.GREEN,
  EYE_COLOR.HAZEL,
  EYE_COLOR.GRAY,
  EYE_COLOR.BLACK,
  EYE_COLOR.AMBER,
  EYE_COLOR.VIOLET,
  EYE_COLOR.RED,
] as const;

export const EYE_COLOR_LABLES = generateLabelsMap(EYE_COLORS);

export const EYE_COLOR_LABEL_VALUE_PAIRS = generateLabelValuePairs(EYE_COLORS);
