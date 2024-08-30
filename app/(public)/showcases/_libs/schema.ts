import { stringToNumberOrError } from "@/lib/validators/req-query";
import { z } from "zod";

export const SearchParamsSchema = z.object({
  page: stringToNumberOrError.optional(),
});
