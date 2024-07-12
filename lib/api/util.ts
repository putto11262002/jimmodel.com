import { z } from "zod";

export const stringToNumberOrUndefined = z.string().transform((v) => {
  const parsed = parseInt(v, 10);
  if (isNaN(parsed)) {
    return undefined;
  }
  return parsed;
});

export const stringToNumberOrDefault = (defaultValue: number) =>
  z.string().transform((v) => {
    const parsed = parseInt(v, 10);
    if (isNaN(parsed)) {
      return defaultValue;
    }
    return parsed;
  });
