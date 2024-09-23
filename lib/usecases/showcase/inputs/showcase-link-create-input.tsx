import { z } from "zod";

export const ShowcaseLinkCreateInputSchema = z.object({
  url: z.string().url(),
});

export type ShowcaseLinkCreateInput = z.infer<
  typeof ShowcaseLinkCreateInputSchema
>;
