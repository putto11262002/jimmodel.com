import { genders } from "@/db/data/genders";
import { z } from "zod";
import { ethnicities } from "@/db/data/ethnicities";
import { eyeColors } from "@/db/data/eye-colors";
import { hairColors } from "@/db/data/hair-colors";
import { applicationImageTypes } from "@/db/schemas";
import { imageValidator } from "./file";
import { countryNames } from "@/db/data/countries";

export const ApplicationExperienceCreateInputSchema = z.object({
  year: z.number(),
  product: z.string(),
  country: z.enum(countryNames),
  media: z.string(),
  details: z.string().nullable().optional(),
});

export const ApplicationCreateInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().nullable().optional(),
  email: z.string().email(),
  lineId: z.string().nullable().optional(),
  wechat: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  dateOfBirth: z
    .string()
    .datetime()
    .or(z.date().transform((v) => v.toISOString()))
    .nullable()
    .optional(),
  gender: z.enum(genders),
  nationality: z.enum(countryNames).nullable().optional(),
  ethnicity: z.enum(ethnicities).nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  zipCode: z.string().nullable().optional(),
  country: z.enum(countryNames).nullable().optional(),
  talents: z.string().nullable().optional(),
  aboutMe: z.string().nullable().optional(),
  height: z.number().nullable().optional(),
  weight: z.number().nullable().optional(),
  bust: z.number().nullable().optional(),
  hips: z.number().nullable().optional(),
  suitDressSize: z.string().nullable().optional(),
  shoeSize: z.number().nullable().optional(),
  eyeColor: z.enum(eyeColors).nullable().optional(),
  hairColor: z.enum(hairColors).nullable().optional(),
  experiences: z
    .array(ApplicationExperienceCreateInputSchema)
    .nullable()
    .optional(),
});

export const ApplicationImageCreateInputSchema = z.object({
  file: imageValidator(),
  type: z.enum(applicationImageTypes),
});
