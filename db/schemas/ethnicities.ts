import { pgEnum } from "drizzle-orm/pg-core";

export type Ethnicity = (typeof ethnicities)[number];

export const ethnicities = [
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

export const ethnicityEnum = pgEnum("ethnicity", ethnicities);
