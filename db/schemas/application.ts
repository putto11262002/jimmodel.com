import { relations, sql } from "drizzle-orm";
import {
  integer,
  PgArray,
  pgEnum,
  pgTable,
  real,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { fileInfoTable } from "./file-metadata";
import {
  countryEnum,
  ethnicityEnum,
  eyeColorEnum,
  genderEnum,
  hairColorEnum,
} from "./enums";

export const applicationStatuses = ["pending", "approved", "rejected"] as const;

export const applicationStatusEnum = pgEnum(
  "application_status",
  applicationStatuses,
);

export const applicationTable = pgTable("applications", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  phoneNumber: varchar("phone_number"),
  email: varchar("email").notNull(),
  lineId: varchar("line_id"),
  wechat: varchar("wechat"),
  facebook: varchar("facebook"),
  instagram: varchar("instagram"),
  whatsapp: varchar("whatsapp"),
  dateOfBirth: varchar("date_of_birth"),
  gender: genderEnum("gender").notNull(),
  nationality: countryEnum("nationality"),
  ethnicity: ethnicityEnum("ethnicity"),
  address: varchar("address"),
  city: varchar("city"),
  region: varchar("region"),
  zipCode: varchar("zip_code"),
  country: countryEnum("country"),
  talents: varchar("talents").array(),
  aboutMe: varchar("about_me"),
  height: real("height"),
  weight: real("weight"),
  bust: real("bust"),
  hips: real("hips"),
  suitDressSize: varchar("suit_dress_size"),
  shoeSize: real("shoe_size"),
  eyeColor: eyeColorEnum("eye_color"),
  hairColor: hairColorEnum("hair_color"),
  status: applicationStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  }).default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true })
    .$onUpdateFn(() => sql`now()`)
    .default(sql`now()`),
});

export const applicationRelations = relations(applicationTable, ({ many }) => ({
  experiences: many(applicationExperienceTable),
  images: many(applicationImageTable),
}));

export const applicationExperienceTable = pgTable("application_experiences", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  applicationId: uuid("application_id"),
  year: integer("year").notNull(),
  media: varchar("media").notNull(),
  country: countryEnum("country").notNull(),
  product: varchar("product").notNull(),
  details: varchar("details"),
});

export const applicationExperienceRelations = relations(
  applicationExperienceTable,
  ({ one }) => ({
    application: one(applicationTable, {
      fields: [applicationExperienceTable.applicationId],
      references: [applicationTable.id],
    }),
  }),
);

export const applicationImageTypes = [
  "full",
  "half",
  "closeup",
  "other",
] as const;

export type ApplicationImageType = (typeof applicationImageTypes)[number];

export const applicationImageTypeEnum = pgEnum(
  "application_image_type",
  applicationImageTypes,
);

export const applicationImageTable = pgTable("application_images", {
  fileId: uuid("file_id")
    .references(() => fileInfoTable.id)
    .notNull(),
  type: applicationImageTypeEnum("type").notNull(),
  applicationId: uuid("application_id").references(() => applicationTable.id),
  createdAt: timestamp("created_at", { mode: "string" }).default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .$onUpdateFn(() => sql`now()`)
    .default(sql`now()`),
});

export const applicationImageRelations = relations(
  applicationImageTable,
  ({ one }) => ({
    application: one(applicationTable, {
      fields: [applicationImageTable.applicationId],
      references: [applicationTable.id],
    }),
  }),
);
