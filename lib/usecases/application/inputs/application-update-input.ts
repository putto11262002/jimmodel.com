import {
  COUNTRIES,
  ETHNICITIES,
  EYE_COLORS,
  GENDERS,
  HAIR_COLORS,
} from "@/db/constants";
import { NewApplication } from "@/db/schemas";
import { z } from "zod";

export type ApplicationUpdateInput = Partial<
  Omit<
    NewApplication,
    "id" | "createdAt" | "updatedAt" | "status" | "expiredAt"
  >
>;

export const ApplicationUpdateInputSchema = z.object({
  name: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  lineId: z.string().nullable().optional(),
  wechat: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  dateOfBirth: z
    .string()
    .datetime()
    .or(z.date().transform((v) => v.toISOString()))
    .optional(),
  gender: z.enum(GENDERS).nullable().optional(),
  nationality: z.enum(COUNTRIES).nullable().optional(),
  ethnicity: z.enum(ETHNICITIES).nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  zipCode: z.string().nullable().optional(),
  country: z.enum(COUNTRIES).nullable().optional(),
  talents: z.array(z.string()).nullable().optional(),
  aboutMe: z.string().nullable().optional(),
  height: z.number().nullable().optional(),
  weight: z.number().nullable().optional(),
  bust: z.number().nullable().optional(),
  chest: z.number().nullable().optional(),
  hips: z.number().nullable().optional(),
  suitDressSize: z.string().nullable().optional(),
  shoeSize: z.number().nullable().optional(),
  eyeColor: z.enum(EYE_COLORS).nullable().optional(),
  hairColor: z.enum(HAIR_COLORS).nullable().optional(),
});
