import { pgEnum } from "drizzle-orm/pg-core";

export const eyeColors = [
  "brown",
  "blue",
  "green",
  "hazel",
  "gray",
  "black",
  "amber",
  "violet",
  "red",
] as const;

export type EyeColor = (typeof eyeColors)[number];

export const eyeColorEnum = pgEnum("eye_color", eyeColors);
