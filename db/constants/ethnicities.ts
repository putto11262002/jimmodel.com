import { generateLabelValuePairs } from "./utils";

export const ETHNICITIES = [
  "African",
  "African American",
  "Asian",
  "Central Asian",
  "East Asian",
  "European",
  "Hispanic",
  "Indigenous American",
  "Latinx",
  "Middle Eastern",
  "Near Eastern",
  "North African",
  "Oceanian",
  "South Asian",
  "Southeast Asian",
  "West Asian",
] as const;

export const ETHNICITY_LABEL_VALUE_PAIRS = generateLabelValuePairs(
  ETHNICITIES,
  (ethnicity) => ethnicity
);
