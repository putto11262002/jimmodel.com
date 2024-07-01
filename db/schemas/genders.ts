import { pgEnum } from "drizzle-orm/pg-core";

export type Gender = (typeof genders)[number];
export const genders = ["Male", "Female", "Non-binary", "Genderfluid"] as const;

export const genderEnum = pgEnum("gender", genders);
