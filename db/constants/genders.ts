import { generateLabelsMap, generateLabelValuePairs } from "./utils";

export const GENDER = {
  MALE: "male",
  FEMALE: "female",
  NON_BINARY: "non-binary",
} as const;

export const GENDERS = [GENDER.MALE, GENDER.FEMALE, GENDER.NON_BINARY] as const;

export const GENDER_LABELS = generateLabelsMap(GENDERS);

export const GENER_LABEL_VALUE_PAIRS = generateLabelValuePairs(GENDERS);
