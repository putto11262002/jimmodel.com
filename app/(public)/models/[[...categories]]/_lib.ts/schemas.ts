import { modelCategories } from "@/lib/constants/model";
import { ModelCategory } from "@/lib/types/model";
import { z } from "zod";
export const localQueries = ["local", "non-local", "all"] as const;
export type LocalQuery = (typeof localQueries)[number];
export const directBookingQueries = [
  "direct booking",
  "non-direct booking",
  "all",
] as const;
export type DirectBookingQuery = (typeof directBookingQueries)[number];
export const inTownQueries = ["in town", "out town", "all"] as const;
export type InTownQuery = (typeof inTownQueries)[number];

export const SearchParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .nullable()
    .transform((value) => {
      if (!value) {
        return 1;
      }
      // regex to check if the string is valid number
      if (/^\d+$/.test(value)) {
        const parsedPage = parseInt(value);
        return parsedPage > 0 ? parsedPage : 1;
      }
      return 1;
    }),
});

type PathParams = {
  category?: ModelCategory;
  inTown?: boolean;
  directBooking?: boolean;
  local?: boolean;
};
export const PathParamsSchema = z.object({
  categories: z
    .array(z.string())
    .transform((value) => {
      let output: PathParams = {};
      if (
        value.length >= 1 &&
        modelCategories.includes(value[0] as ModelCategory)
      ) {
        output.category = value[0] as ModelCategory;
      }
      if (value.length >= 2) {
        switch (value[1]) {
          case "local":
            output.local = true;
            break;
          case "in-town":
            output.inTown = true;
            break;
          case "direct-booking":
            output.directBooking = true;
            break;
        }
      }
      return output;
    })
    .or(z.any().transform(() => ({}) as PathParams)),
});
