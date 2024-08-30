import {
  stringToNumberOrError,
  stringToNumberOrUndefined,
} from "@/lib/validators/req-query";
import { z } from "zod";

export const querySchema = z.object({
  page: stringToNumberOrUndefined.transform((v) => {
    if (!v) return 1;
    if (v < 1) {
      return 1;
    }
    return v;
  }),
  read: z.any().transform((v) => {
    if (v === "true") return true;
    if (v === "false") return false;
    return undefined;
  }),
});
