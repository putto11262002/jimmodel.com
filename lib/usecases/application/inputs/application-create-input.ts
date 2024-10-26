import {
  COUNTRIES,
  ETHNICITIES,
  EYE_COLORS,
  GENDERS,
  HAIR_COLORS,
} from "@/db/constants";
import { NewApplication } from "@/db/schemas";
import { z } from "zod";

export type CompletedApplication = Omit<
  NewApplication,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "status"
  | "expiredAt"
  | "name"
  | "email"
  | "dateOfBirth"
  | "gender"
  | "aboutMe"
  | "height"
  | "weight"
> & {
  name: Exclude<NewApplication["name"], undefined | null>;
  email: Exclude<NewApplication["email"], undefined | null>;
  dateOfBirth: Exclude<NewApplication["dateOfBirth"], undefined | null>;
  gender: Exclude<NewApplication["gender"], undefined | null>;
  aboutMe: Exclude<NewApplication["aboutMe"], undefined | null>;
  height: Exclude<NewApplication["height"], undefined | null>;
  weight: Exclude<NewApplication["weight"], undefined | null>;
};

export const CompletedApplicationSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Required",
      required_error: "Required",
    })
    .min(1, "Required"),
  phoneNumber: z.string().nullable().optional(),
  email: z
    .string({
      invalid_type_error: "Required",
      required_error: "Required",
    })
    .email(),
  lineId: z.string().nullable().optional(),
  wechat: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  dateOfBirth: z
    .string({
      invalid_type_error: "Required",
      required_error: "Required",
    })
    .datetime("Invalid date")
    .or(z.date().transform((v) => v.toISOString())),
  gender: z.enum(GENDERS, {
    required_error: "Required",
    invalid_type_error: "Required",
  }),
  nationality: z.enum(COUNTRIES).nullable().optional(),
  ethnicity: z.enum(ETHNICITIES).nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  zipCode: z.string().nullable().optional(),
  country: z.enum(COUNTRIES).nullable().optional(),
  talents: z.array(z.string()).nullable().optional(),
  aboutMe: z
    .string({ required_error: "Required", invalid_type_error: "Required" })
    .superRefine((v, ctx) => {
      if (v.length < 80) {
        ctx.addIssue({
          message: `At least 80 characters required, but got ${v.length}`,
          path: ["aboutMe"],
          code: z.ZodIssueCode.custom,
        });
      }
    }),
  height: z.number({
    invalid_type_error: "Required",
    required_error: "Required",
  }),
  weight: z.number({
    invalid_type_error: "Required",
    required_error: "Required",
  }),
  bust: z.number().nullable().optional(),
  chest: z.number().nullable().optional(),
  hips: z.number().nullable().optional(),
  suitDressSize: z.string().nullable().optional(),
  shoeSize: z.number().nullable().optional(),
  eyeColor: z.enum(EYE_COLORS).nullable().optional(),
  hairColor: z.enum(HAIR_COLORS).nullable().optional(),
});

export const ApplicationGeneralSchema = CompletedApplicationSchema.pick({
  name: true,
  dateOfBirth: true,
  gender: true,
  nationality: true,
  ethnicity: true,
  aboutMe: true,
});

export const ApplicationContactSchema = CompletedApplicationSchema.pick({
  phoneNumber: true,
  email: true,
  lineId: true,
  wechat: true,
  facebook: true,
  instagram: true,
  whatsapp: true,
});

export const ApplicationAddressSchema = CompletedApplicationSchema.pick({
  address: true,
  city: true,
  region: true,
  zipCode: true,
  country: true,
});

export const ApplicationTalentSchema = CompletedApplicationSchema.pick({
  talents: true,
});

export const ApplicationMeasurementSchema = CompletedApplicationSchema.pick({
  height: true,
  weight: true,
  bust: true,
  chest: true,
  hips: true,
  suitDressSize: true,
  shoeSize: true,
  eyeColor: true,
  hairColor: true,
});

export const OptionalApplicationCreateInputSchema = z.object({
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
