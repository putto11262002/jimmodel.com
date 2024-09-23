import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  timestamp,
  real,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import idTimestamp from "@/db/schemas/base";
import {
  modelExperienceTable,
  modelBlockTable,
  modelImageTable,
} from "@/db/schemas/model";
import { fileMetadataTable } from "../file-metadata";
import {
  GENDERS,
  EYE_COLORS,
  HAIR_COLORS,
  MODEL_CATEGORIES,
  ETHNICITIES,
  COUNTRIES,
  BOOKING_STATUSES,
} from "@/db/constants";

export const modelTable = pgTable("models", {
  ...idTimestamp,
  // General
  name: text("name").notNull(),
  nickname: text("nickname"),
  dateOfBirth: timestamp("date_of_birth", {
    mode: "string",
    withTimezone: true,
  }),
  gender: text("gender", { enum: GENDERS }).notNull(),

  // Contact
  phoneNumber: text("phone_number"),
  email: text("email"),
  lineId: text("lineId"),
  whatsapp: text("whatsapp"),
  wechat: text("wechat"),
  instagram: text("instagram"),
  facebook: text("facebook"),

  // Background
  nationality: text("nationality", { enum: COUNTRIES }),
  ethnicity: text("ethnicity", { enum: ETHNICITIES }),
  countryOfResidence: text("country_of_residence", { enum: COUNTRIES }),
  occupation: text("occupation"),
  highestLevelOfEducation: text("highest_level_of_education"),
  medicalInfo: text("medical_info"),
  spokenLanguages: text("spoken_languages").array(),

  // Identification
  passportNumber: text("passport_number"),
  idCardNumber: text("id_card_number"),
  taxId: text("tax_id"),

  // Address
  address: text("address"),
  city: text("city"),
  region: text("region"),
  zipCode: text("zipCode"),
  country: text("country", { enum: COUNTRIES }),

  // Emergency Contact
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhoneNumber: text("emergency_contact_phone_number"),
  emergencyContactRelationship: text("emergency_contact_relationship"),

  // Modeling
  talents: text("talents").array(),
  aboutMe: text("about_me"),
  underwareShooting: boolean("underware_shooting"),
  motherAgency: text("mother_agency"),

  // General Measurements
  height: real("height"), // cm
  weight: real("weight"), // kg
  chest: real("chest"),
  bust: real("bust"),
  waist: real("waist"),
  hips: real("hips"),
  shoeSize: real("shoe_size"),
  braSize: text("bra_size"),
  hairColor: text("hair_color", { enum: HAIR_COLORS }),
  eyeColor: text("eye_color", { enum: EYE_COLORS }),

  // Upper Body Measurements
  collar: real("collar"),
  chestHeight: real("chest_height"),
  chestWidth: real("chest_width"),
  shoulder: real("shoulder"),
  aroundArmpit: real("around_armpit"),
  frontShoulder: real("front_shoulder"),
  frontLength: real("front_length"),
  backShoulder: real("back_shoulder"),
  backLength: real("back_length"),

  // Arm Measurements
  aroundUpperArm: real("around_upper_arm"),
  aroundElbow: real("around_elbow"),
  aroundWrist: real("around_wrist"),
  shoulderToWrist: real("shoulder_to_wrist"),
  shoulderToElbow: real("shoulder_to_elbow"),

  // Lower Body Measurements
  aroundThigh: real("around_thigh"),
  aroundKnee: real("around_knee"),
  aroundAnkle: real("around_ankle"),
  inSeam: real("in_seam"),
  outSeam: real("out_seam"),
  crotch: real("crotch"),

  // Additional Measurements
  tattoos: boolean("tattoos"),
  scars: boolean("scars"),

  // Settings
  bookingStatus: text("booking_status", { enum: BOOKING_STATUSES }).notNull(),
  published: boolean("public").default(false).notNull(),
  category: text("category", { enum: MODEL_CATEGORIES }).notNull(),

  profileImageId: uuid("profile_image_id").references(
    () => fileMetadataTable.id
  ),
});

export const modelRelations = relations(modelTable, ({ many, one }) => ({
  images: many(modelImageTable),
  profileImage: one(fileMetadataTable, {
    fields: [modelTable.profileImageId],
    references: [fileMetadataTable.id],
  }),
  expereinces: many(modelExperienceTable),
  blocks: many(modelBlockTable),
}));

export type Model = typeof modelTable.$inferSelect;
export type NewModel = typeof modelTable.$inferInsert;
