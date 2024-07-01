import { pgEnum } from "drizzle-orm/pg-core";

export const hairColors = [
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

export type HairColor = (typeof hairColors)[number];

export const hairColorEnum = pgEnum("hair_color", hairColors);
