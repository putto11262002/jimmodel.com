import { pgEnum } from "drizzle-orm/pg-core";
import { genders } from "../data/genders";
import { eyeColors } from "../data/eye-colors";
import { hairColors } from "../data/hair-colors";
import { ethnicities } from "../data/ethnicities";
import { countryNames } from "../data/countries";

export const genderEnum = pgEnum("gender", genders);

export const eyeColorEnum = pgEnum("eye_color", eyeColors);

export const hairColorEnum = pgEnum("hair_color", hairColors);

export const ethnicityEnum = pgEnum("ethnicity", ethnicities);

export const countryEnum = pgEnum("country", countryNames);
