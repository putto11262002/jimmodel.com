import { NewModelBlock } from "@/db/schemas";
import { z } from "zod";

export type ModelBlockCreateInput = Omit<
  NewModelBlock,
  "id" | "createdAt" | "updatedAt" | "modelId" | "modelName"
>;

export const ModelBlockCreateInputSchema = z
  .object({
    start: z.string().datetime(),
    end: z.string().datetime(),
    reason: z.string(),
  })
  .superRefine((data, ctx) => {
    if (new Date(data.start) > new Date(data.end)) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["start"],

        message: "Start date must be before end date",
      });
    }
  });
