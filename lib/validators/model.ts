import { ethnicities } from "@/db/schemas/ethnicities";
import { eyeColors } from "@/db/schemas/eye-color";
import { genders } from "@/db/schemas/genders";
import { hairColors } from "@/db/schemas/hair-color";
import { z } from "zod";

export const CreateModelSchema = z.object({
  name: z.string().min(1, "Name is required"), // Required
  gender: z.enum(genders, { required_error: "Gender is required" }), // Required
  nickname: z.string().nullable().optional(),
  dateOfBirth: z.date().nullable().optional(),

  // Contact info
  phoneNumber: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  lineId: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  wechat: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),

  // Personal info
  nationality: z.string().nullable().optional(),
  ethnicity: z.enum(ethnicities).nullable().optional(), // You can replace with ethnicityEnum.optional() if defined
  countryOfResidence: z.string().nullable().optional(),
  spokenLanguages: z.array(z.string()).nullable().optional(),
  occupation: z.string().nullable().optional(),
  highestLevelOfEducation: z.string().nullable().optional(),
  medicalInfo: z.string().nullable().optional(),

  // Identifications + Documents
  passportNumber: z.string().nullable().optional(),
  idCardNumber: z.string().nullable().optional(),
  taxId: z.string().nullable().optional(),

  // Address
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  zipCode: z.string().nullable().optional(),
  country: z.string().nullable().optional(),

  // Emergency contact
  emergencyContactName: z.string().nullable().optional(),
  emergencyContactPhoneNumber: z.string().nullable().optional(),
  emergencyContactRelationship: z.string().nullable().optional(),

  // Modeling info
  talents: z.string().nullable().optional(),
  aboutMe: z.string().nullable().optional(),
  underwareShooting: z.boolean().nullable().optional(),

  height: z.number().positive().nullable().optional(), // cm
  weight: z.number().positive().nullable().optional(), // kg
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
});

export const UpdateModelSchema = z.object({
  name: z.string().min(1, "Name is required"), // Required
  gender: z.enum(genders, { required_error: "Gender is required" }), // Required
  nickname: z.string().nullable().optional(),
  dateOfBirth: z.date().nullable().optional(),

  // Contact info
  phoneNumber: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  lineId: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  wechat: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),

  // Personal info
  nationality: z.string().nullable().optional(),
  ethnicity: z.enum(ethnicities).nullable().optional(), // You can replace with ethnicityEnum.optional() if defined
  countryOfResidence: z.string().nullable().optional(),
  spokenLanguages: z.array(z.string()).nullable().optional(),
  occupation: z.string().nullable().optional(),
  highestLevelOfEducation: z.string().nullable().optional(),
  medicalInfo: z.string().nullable().optional(),

  // Identifications + Documents
  passportNumber: z.string().nullable().optional(),
  idCardNumber: z.string().nullable().optional(),
  taxId: z.string().nullable().optional(),

  // Address
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  zipCode: z.string().nullable().optional(),
  country: z.string().nullable().optional(),

  // Emergency contact
  emergencyContactName: z.string().nullable().optional(),
  emergencyContactPhoneNumber: z.string().nullable().optional(),
  emergencyContactRelationship: z.string().nullable().optional(),

  // Modeling info
  talents: z.string().nullable().optional(),
  aboutMe: z.string().nullable().optional(),
  underwareShooting: z.boolean().nullable().optional(),

  height: z.number().positive().nullable().optional(), // cm
  weight: z.number().positive().nullable().optional(), // kg
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
});
