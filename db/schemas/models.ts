import { relations, sql } from "drizzle-orm";
import {
  varchar,
  boolean,
  pgTable,
  timestamp,
  real,
  date,
  uuid,
  foreignKey,
  integer,
} from "drizzle-orm/pg-core";

import { modelImageTable } from "./model-images";
import {
  countryEnum,
  ethnicityEnum,
  eyeColorEnum,
  genderEnum,
  hairColorEnum,
} from "./enums";

export const modelTable = pgTable(
  "models",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    name: varchar("name").notNull(),
    nickname: varchar("nickname"),
    dateOfBirth: date("date_of_birth"),
    gender: genderEnum("gender").notNull(),

    phoneNumber: varchar("phone_number"),
    email: varchar("email"),
    lineId: varchar("lineId"),
    whatsapp: varchar("whatsapp"),
    wechat: varchar("wechat"),
    instagram: varchar("instagram"),
    facebook: varchar("facebook"),

    nationality: countryEnum("nationality"),
    ethnicity: ethnicityEnum("ethnicity"),
    countryOfResidence: countryEnum("country_of_residence"),
    occupation: varchar("occupation"),
    highestLevelOfEducation: varchar("highest_level_of_education"),
    medicalInfo: varchar("medical_info"),
    spokenLanguages: varchar("spoken_languages").array(),
    passportNumber: varchar("passport_number"),
    idCardNumber: varchar("id_card_number"),
    taxId: varchar("tax_id"),

    address: varchar("address"),
    city: varchar("city"),
    region: varchar("region"),
    zipCode: varchar("zipCode"),
    country: countryEnum("country"),

    emergencyContactName: varchar("emergency_contact_name"),
    emergencyContactPhoneNumber: varchar("emergency_contact_phone_number"),
    emergencyContactRelationship: varchar("emergency_contact_relationship"),

    talents: varchar("talents"),
    aboutMe: varchar("about_me"),
    underwareShooting: boolean("underware_shooting"),

    height: real("height"), // cm
    weight: real("weight"), // kg

    collar: real("collar"),
    chest: real("chest"),

    chestHeight: real("chest_height"),
    chestWidth: real("chest_width"),

    waist: real("waist"),
    hips: real("hips"),

    shoulder: real("shoulder"),

    braSize: varchar("bra_size"),

    tattoos: boolean("tattoos"),
    scars: boolean("scars"),

    aroundArmpit: real("around_armpit"),

    // Font side
    frontShoulder: real("front_shoulder"),
    frontLength: real("front_length"),

    // Back side
    backShoulder: real("back_shoulder"),
    backLength: real("back_length"),

    // Around arm to wrist
    aroundUpperArm: real("around_upper_arm"),
    aroundElbow: real("around_elbow"),
    aroundWrist: real("around_wrist"),

    // Arm length
    shoulderToWrist: real("shoulder_to_wrist"),
    shoulderToElbow: real("shoulder_to_elbow"),

    // Around thigh to ankle
    aroundThigh: real("around_thigh"),
    aroundKnee: real("around_knee"),
    aroundAnkle: real("around_ankle"),

    // Trousers length
    inSeam: real("in_seam"),
    outSeam: real("out_seam"),

    crotch: real("crotch"),

    shoeSize: real("shoe_size"),

    hairColor: hairColorEnum("hair_color"),
    eyeColor: eyeColorEnum("eye_color"),

    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),

    local: boolean("local").default(false),
    inTown: boolean("intown").default(false),
    directBooking: boolean("direct_booking").default(false),

    published: boolean("public").default(false),
    active: boolean("inactive").default(true),

    tags: varchar("tags").array(),

    profileFileId: uuid("profile_file_id"),
  },
  (table) => ({
    profileImageFk: foreignKey({
      foreignColumns: [modelImageTable.modelId, modelImageTable.fileId],
      columns: [table.id, table.profileFileId],
      name: "profile_image_fk",
    }),
  }),
);

export const modelRelations = relations(modelTable, ({ many, one }) => ({
  images: many(modelImageTable),
  profileImage: one(modelImageTable),
  expereinces: many(modelExperienceTable),
}));

export type ModelCreateInput = typeof modelTable.$inferInsert;

export type Model = typeof modelTable.$inferSelect;

export type ModelUpdateInput = Partial<
  Omit<typeof modelTable.$inferInsert, "id" | "createdAt" | "updatedAt">
>;

/**
 * ModelProfile represents the basic information of the model that is used frequently.
 *
 * */
export type ModelProfile = Pick<
  Model,
  "id" | "name" | "gender" | "dateOfBirth"
> & {
  profileImage: {
    fileId: string;
  } | null;
};

export const modelBlockTable = pgTable("model_blocks", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  modelId: uuid("model_id")
    .references(() => modelTable.id)
    .notNull(),
  start: timestamp("start", { mode: "string", withTimezone: true }).notNull(),
  end: timestamp("end", { mode: "string", withTimezone: true }).notNull(),
  reason: varchar("reason").notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const modelBlockRelations = relations(modelBlockTable, ({ one }) => ({
  model: one(modelTable, {
    fields: [modelBlockTable.modelId],
    references: [modelTable.id],
  }),
}));

export const modelExperienceTable = pgTable("model_experiences", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  modelId: uuid("application_id"),
  year: integer("year").notNull(),
  media: varchar("media").notNull(),
  country: countryEnum("country").notNull(),
  product: varchar("product").notNull(),
  details: varchar("details"),
});

export const modelExperienceRelations = relations(
  modelExperienceTable,
  ({ one }) => ({
    model: one(modelTable, {
      fields: [modelExperienceTable.modelId],
      references: [modelTable.id],
    }),
  }),
);
