import { z } from "zod";

export type ApplicationSubmissionInput = {
  termsOfService: boolean;
  privacyPolicy: boolean;
};

export const ApplicationSubmissionInputSchema = z.object({
  termsOfService: z
    .boolean({
      required_error: "Required",
      invalid_type_error: "Required",
    })
    .refine((v) => v, "Please accept the terms of service"),
  privacyPolicy: z
    .boolean({
      required_error: "Required",
      invalid_type_error: "Required",
    })
    .refine((v) => v, "Please accept the privacy policy"),
});
