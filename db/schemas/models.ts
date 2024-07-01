import { sql } from "drizzle-orm";
import {
  varchar,
  boolean,
  pgTable,
  timestamp,
  real,
  date,
  pgEnum,
  primaryKey,
  foreignKey,
} from "drizzle-orm/pg-core";
import { genderEnum } from "./genders";
import { ethnicityEnum } from "./ethnicities";
import { eyeColorEnum } from "./eye-color";
import { hairColorEnum } from "./hair-color";

export const modelTable = pgTable(
  "models",
  {
    id: varchar("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    name: varchar("name").notNull(),
    nickname: varchar("nickname"),
    dateOfBirth: date("date_of_birth", { mode: "date" }),
    gender: genderEnum("gender").notNull(),

    // Contact info
    phoneNumber: varchar("phone_number"),
    email: varchar("email"),
    lineId: varchar("lineId"),
    whatsapp: varchar("whatsapp"),
    wechat: varchar("wechat"),
    instagram: varchar("instagram"),
    facebook: varchar("facebook"),

    // Personal info
    nationality: varchar("nationality"),
    ethnicity: ethnicityEnum("ethnicity"),
    countryOfResidence: varchar("country_of_residence"),
    spokenLanguages: varchar("spoken_languages").array(),
    occupation: varchar("occupation"),
    highestLevelOfEducation: varchar("highest_level_of_education"),
    medicalInfo: varchar("medical_info"),

    // Identifications + Documents
    passportNumber: varchar("passport_number"),
    idCardNumber: varchar("id_card_number"),
    taxId: varchar("tax_id"),

    // Address
    address: varchar("address"),
    city: varchar("city"),
    region: varchar("region"),
    zipCode: varchar("zipCode"),
    country: varchar("country"),

    // Emergency contact
    emergencyContactName: varchar("emergency_contact_name"),
    emergencyContactPhoneNumber: varchar("emergency_contact_phone_number"),
    emergencyContactRelationship: varchar("emergency_contact_relationship"),

    // Modeling info
    talents: varchar("talents"),
    aboutMe: varchar("about_me"),
    underwareShooting: boolean("underware_shooting"),

    height: real("height"), // cm
    weight: real("weight"), // kg
    // bust: varchar("bust"), // inch
    collar: real("collar"),
    chest: real("chest"),
    chestHeight: real("chest_height"),
    chestWidth: real("chest_width"),

    waist: real("waist"),
    hips: real("hips"),

    shoulder: real("shoulder"), // inches

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

    // images: varchar("images"),
    // experiences: varchar("experiences"),
    createdAt: timestamp("created_at").default(new Date()),
    updatedAt: timestamp("updated_at")
      .default(new Date())
      .$onUpdate(() => new Date()),
    // Job                          Job[]
    // Booking                      Booking[]
    // Block                        Block[]
    public: boolean("public").default(false),
    tags: varchar("tags").array(),

    fileId: varchar("file_id"),
    profileFileId: varchar("profile_file_id"),
  },
  (table) => {
    return {
      profileImageFK: foreignKey({
        columns: [table.id, table.profileFileId],
        foreignColumns: [modelImageTable.modelId, modelImageTable.fileId],
        name: "profile_image_fk",
      }),
    };
  },
);

export type ModelCreateInput = typeof modelTable.$inferInsert;

export type Model = typeof modelTable.$inferSelect;

export type ModelUpdateInput = Omit<
  typeof modelTable.$inferInsert,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * ModelProfile represents the basic information of the model that is used frequently.
 *
 * */
export type ModelProfile = Pick<
  Model,
  "id" | "name" | "gender" | "dateOfBirth"
>;

export const modelImageTypes = ["books", "polaroid", "composite"] as const;

export type ModelIamgeType = (typeof modelImageTypes)[number];

export const modelImageTypeEnum = pgEnum("model_image_type", modelImageTypes);

export const modelImageTable = pgTable(
  "model_images",
  {
    fileId: varchar("file_id"),
    modelId: varchar("model_id"),
    type: modelImageTypeEnum("image_type"),
    isProfile: boolean("is_profile"),
    createdAt: timestamp("created_at").default(new Date()),
    updatedAt: timestamp("updated_at")
      .default(new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.fileId, table.modelId] }),
    };
  },
);

export type ModelImage = typeof modelImageTable.$inferSelect;

export type ModelImageCreateInput = typeof modelImageTable.$inferInsert;
