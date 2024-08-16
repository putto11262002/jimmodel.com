import { countryNames } from "@/db/data/countries";
import { ethnicities } from "@/db/data/ethnicities";
import { eyeColors } from "@/db/data/eye-colors";
import { genders } from "@/db/data/genders";
import { hairColors } from "@/db/data/hair-colors";
import dayjs from "dayjs";
import { z } from "zod";

export const ModelCreateInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.enum(genders, { required_error: "Gender is required" }),
  nickname: z.string().nullable().optional(),
  dateOfBirth: z
    .string({ required_error: "Date of birth is required" })
    .datetime()
    .or(z.string().date())
    .or(z.date().transform((v) => v.toISOString()))
    .refine((v) => (v ? dayjs(v).isBefore(dayjs()) : true), {
      message: "Date of birth must be before today",
    })
    .nullable()
    .optional(),

  phoneNumber: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  lineId: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  wechat: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),

  nationality: z.enum(countryNames).nullable().optional(),
  ethnicity: z.enum(ethnicities).nullable().optional(),
  spokenLanguages: z.array(z.string()).nullable().optional(),
  countryOfResidence: z.enum(countryNames).nullable().optional(),
  occupation: z.string().nullable().optional(),
  highestLevelOfEducation: z.string().nullable().optional(),
  medicalInfo: z.string().nullable().optional(),

  passportNumber: z.string().nullable().optional(),
  idCardNumber: z.string().nullable().optional(),
  taxId: z.string().nullable().optional(),

  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  zipCode: z.string().nullable().optional(),
  country: z.enum(countryNames).nullable().optional(),

  emergencyContactName: z.string().nullable().optional(),
  emergencyContactPhoneNumber: z.string().nullable().optional(),
  emergencyContactRelationship: z.string().nullable().optional(),

  talents: z.array(z.string()).nullable().optional(),
  aboutMe: z.string().nullable().optional(),
  underwareShooting: z.boolean().nullable().optional(),

  height: z.number().positive().nullable().optional(),
  weight: z.number().positive().nullable().optional(),
  // bust: z.string().nullable().optional(), // inch
  collar: z.number().positive().nullable().optional(),
  chest: z.number().positive().nullable().optional(),
  chestHeight: z.number().positive().nullable().optional(),
  chestWidth: z.number().positive().nullable().optional(),

  waist: z.number().positive().nullable().optional(),
  hips: z.number().positive().nullable().optional(),

  shoulder: z.number().positive().nullable().optional(), // inches

  braSize: z.string().nullable().optional(),

  tattoos: z.boolean().nullable().optional(),
  scars: z.boolean().nullable().optional(),

  aroundArmpit: z.number().positive().nullable().optional(),
  // Font side
  frontShoulder: z.number().positive().nullable().optional(),
  frontLength: z.number().positive().nullable().optional(),

  // Back side
  backShoulder: z.number().positive().nullable().optional(),
  backLength: z.number().positive().nullable().optional(),

  // Around arm to wrist
  aroundUpperArm: z.number().positive().nullable().optional(),
  aroundElbow: z.number().positive().nullable().optional(),
  aroundWrist: z.number().positive().nullable().optional(),

  // Arm length
  shoulderToWrist: z.number().positive().nullable().optional(),
  shoulderToElbow: z.number().positive().nullable().optional(),

  // Around thigh to ankle
  aroundThigh: z.number().positive().nullable().optional(),
  aroundKnee: z.number().positive().nullable().optional(),
  aroundAnkle: z.number().positive().nullable().optional(),

  // Trousers length
  inSeam: z.number().positive().nullable().optional(),
  outSeam: z.number().positive().nullable().optional(),

  crotch: z.number().positive().nullable().optional(),

  shoeSize: z.number().positive().nullable().optional(),

  hairColor: z.enum(hairColors).nullable().optional(),
  eyeColor: z.enum(eyeColors).nullable().optional(),

  local: z.boolean().nullable().optional(),
  inTown: z.boolean().nullable().optional(),
  directBooking: z.boolean().nullable().optional(),

  published: z.boolean().nullable().optional(),
  active: z.boolean().nullable().optional(),
});

export const UpdateModelSchema = ModelCreateInputSchema.partial();

export const ModelBlockCreateInputSchema = z.object({
  start: z.string().date().or(z.string().datetime()),
  end: z.string().date().or(z.string().datetime()),
  reason: z.string().min(1, "reason of block is required"),
});

export const ModelExperienceCreateInputSchema = z.object({
  year: z.number(),
  product: z.string(),
  country: z.enum(countryNames),
  media: z.string(),
  details: z.string().nullable().optional(),
});
