import { BOOKING_STATUSES, MODEL_CATEGORIES } from "@/db/constants";
import { z } from "zod";

export const ModelSettingUpdateInputSchema = z.object({
  bookingStatus: z.enum(BOOKING_STATUSES).optional(),
  category: z.enum(MODEL_CATEGORIES).optional(),
  published: z.boolean().optional(),
});
