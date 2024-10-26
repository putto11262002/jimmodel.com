import { ignoreError } from "@/lib/utils/validator";
import { z } from "zod";

export const ContactMessagesGetFilterSchema = z.object({
  page: ignoreError(z.number().positive()),
  pageSize: ignoreError(z.number().positive()),
  pagination: ignoreError(z.boolean()),
  read: ignoreError(z.boolean()),
});

export type ContactMessagesGetFilter = z.infer<
  typeof ContactMessagesGetFilterSchema
>;
