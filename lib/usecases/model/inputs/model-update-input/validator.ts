import dayjs from "dayjs";
import { z } from "zod";
import { ModelUpdateInput } from "./type";
import {
  HAIR_COLORS,
  GENDERS,
  EYE_COLORS,
  ETHNICITIES,
  COUNTRIES,
} from "@/db/constants";
import { stringNumber } from "@/lib/usecases/common/validators/string-number";

export const ModelUpdateInputSchema = z.object({
  // General
  name: z.string().min(1, "Name is required").optional(),
  gender: z.enum(GENDERS, { required_error: "Gender is required" }).optional(),
  nickname: z.string().nullable().optional(),
  dateOfBirth: z
    .string({ required_error: "Date of birth is required" })
    .datetime()
    .or(z.string().date())
    .refine((v) => (v ? dayjs(v).isBefore(dayjs()) : true), {
      message: "Date of birth must be before today",
    })
    .nullable()
    .optional(),

  // Contact
  phoneNumber: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  lineId: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  wechat: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),

  // Background
  nationality: z.enum(COUNTRIES).nullable().optional(),
  ethnicity: z.enum(ETHNICITIES).nullable().optional(),
  spokenLanguages: z.array(z.string()).nullable().optional(),
  countryOfResidence: z.enum(COUNTRIES).nullable().optional(),
  occupation: z.string().nullable().optional(),
  highestLevelOfEducation: z.string().nullable().optional(),
  medicalInfo: z.string().nullable().optional(),

  // Identification
  passportNumber: z.string().nullable().optional(),
  idCardNumber: z.string().nullable().optional(),
  taxId: z.string().nullable().optional(),

  // Address
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  zipCode: z.string().nullable().optional(),
  country: z.enum(COUNTRIES).nullable().optional(),

  // Emergency Contact
  emergencyContactName: z.string().nullable().optional(),
  emergencyContactPhoneNumber: z.string().nullable().optional(),
  emergencyContactRelationship: z.string().nullable().optional(),

  // Modeling
  talents: z.array(z.string()).nullable().optional(),
  aboutMe: z.string().nullable().optional(),
  underwareShooting: z.boolean().nullable().optional(),
  motherAgency: z.string().nullable().optional(),

  // General Measurements
  height: z.number().positive().nullable().optional(),
  weight: z.number().positive().nullable().optional(),
  bust: z.number().nullable().optional(), // inch
  chest: z.number().positive().nullable().optional(),
  waist: z.number().positive().nullable().optional(),
  hips: z.number().positive().nullable().optional(),
  shoeSize: z.number().positive().nullable().optional(),
  braSize: z.string().nullable().optional(),
  hairColor: z.enum(HAIR_COLORS).nullable().optional(),
  eyeColor: z.enum(EYE_COLORS).nullable().optional(),

  collar: z.number().positive().nullable().optional(),
  chestHeight: z.number().positive().nullable().optional(),
  chestWidth: z.number().positive().nullable().optional(),
  shoulder: z.number().positive().nullable().optional(), // inches
  frontShoulder: z.number().positive().nullable().optional(),
  frontLength: z.number().positive().nullable().optional(),
  backShoulder: z.number().positive().nullable().optional(),
  backLength: z.number().positive().nullable().optional(),
  aroundArmpit: z.number().positive().nullable().optional(),

  aroundUpperArm: z.number().positive().nullable().optional(),
  aroundElbow: z.number().positive().nullable().optional(),
  aroundWrist: z.number().positive().nullable().optional(),
  shoulderToWrist: z.number().positive().nullable().optional(),
  shoulderToElbow: z.number().positive().nullable().optional(),

  // Lower Body Measurements
  aroundThigh: z.number().positive().nullable().optional(),
  aroundKnee: z.number().positive().nullable().optional(),
  aroundAnkle: z.number().positive().nullable().optional(),
  inSeam: z.number().positive().nullable().optional(),
  outSeam: z.number().positive().nullable().optional(),
  crotch: z.number().positive().nullable().optional(),

  tattoos: z.boolean().nullable().optional(),
  scars: z.boolean().nullable().optional(),
});
