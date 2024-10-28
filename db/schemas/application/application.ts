import { relations } from "drizzle-orm";
import {
  pgTable,
  real,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import idTimestamp from "../base";
import {
  APPLICATION_STATUS,
  APPLICATION_STATUSES,
} from "@/db/constants/application-statuses";
import { applicationImageTable } from "./image";
import { applicationExperienceTable } from "./experience";
import { GENDERS } from "@/db/constants/genders";
import { COUNTRIES } from "@/db/constants/countries";
import { ETHNICITIES } from "@/db/constants/ethnicities";
import { HAIR_COLORS } from "@/db/constants/hair-colors";
import { EYE_COLORS } from "@/db/constants/eye-colors";
import { modelTable } from "../model";

export const applicationTable = pgTable("applications", {
  // General
  name: varchar("name"),
  dateOfBirth: varchar("date_of_birth"),
  gender: text("gender", { enum: GENDERS }),
  nationality: text("nationality", { enum: COUNTRIES }),
  ethnicity: text("ethnicity", { enum: ETHNICITIES }),
  aboutMe: varchar("about_me"),

  // Contact
  phoneNumber: varchar("phone_number"),
  email: varchar("email"),
  lineId: varchar("line_id"),
  wechat: varchar("wechat"),
  facebook: varchar("facebook"),
  instagram: varchar("instagram"),
  whatsapp: varchar("whatsapp"),

  // Address
  address: varchar("address"),
  city: varchar("city"),
  region: varchar("region"),
  zipCode: varchar("zip_code"),
  country: text("country", { enum: COUNTRIES }),

  talents: varchar("talents").array(),

  // Measurements
  height: real("height"),
  weight: real("weight"),
  bust: real("bust"),
  chest: real("chest"),
  hips: real("hips"),
  suitDressSize: varchar("suit_dress_size"),
  shoeSize: real("shoe_size"),
  eyeColor: text("eye_color", { enum: EYE_COLORS }),
  hairColor: text("hair_color", { enum: HAIR_COLORS }),

  submittedAt: timestamp("submitted_at", {
    withTimezone: true,
  }),
  expiredAt: timestamp("expired_at", {
    mode: "string",
    withTimezone: true,
  }).notNull(),

  modelId: uuid("model_id").references(() => modelTable.id, {
    onDelete: "set null",
  }),

  status: text("status", { enum: APPLICATION_STATUSES })
    .default(APPLICATION_STATUS.IN_PROGRESS)
    .notNull(),
  ...idTimestamp,
});

export const applicationRelations = relations(applicationTable, ({ many }) => ({
  experiences: many(applicationExperienceTable),
  images: many(applicationImageTable),
}));

export type Application = typeof applicationTable.$inferSelect;
export type NewApplication = typeof applicationTable.$inferInsert;
