import { z } from "zod";

export function isZodPrimitive<T extends z.ZodTypeAny>(
  zodField: unknown,
  zodPrimitive: T
): T | null {
  // Base case: Check if the current zodField is an instance of the primitive
  if (zodField instanceof zodPrimitive.constructor) {
    return zodField as T;
  }

  // If the zodField is a ZodOptional, unwrap and check the inner type
  if (zodField instanceof z.ZodOptional) {
    return isZodPrimitive(zodField.unwrap(), zodPrimitive);
  }

  // If the zodField is a ZodNullable, unwrap and check the inner type
  if (zodField instanceof z.ZodNullable) {
    return isZodPrimitive(zodField.unwrap(), zodPrimitive);
  }

  // If the zodField is a ZodEffects, check the inner type
  if (zodField instanceof z.ZodEffects) {
    return isZodPrimitive(zodField.innerType(), zodPrimitive);
  }

  if (zodField instanceof z.ZodDefault) {
    return isZodPrimitive(zodField.removeDefault(), zodPrimitive);
  }

  // If the zodField is a ZodUnion, check if any of its options is the primitive
  if (zodField instanceof z.ZodUnion) {
    for (const option of zodField.options as z.ZodTypeAny[]) {
      const result = isZodPrimitive(option, zodPrimitive);
      if (result !== null) {
        return result; // Return the matching primitive if found
      }
    }
  }

  // If we reach here, it means the current type is not a wrapper or doesn't match the primitive
  return null; // Return null if no match is found
}

export function isZodPrimitiveV2<T extends z.ZodTypeAny>(
  zodField: unknown,
  zodPrimitive: T
): { ok: true; value: T } | { ok: false } {
  // Base case: Check if the current zodField is an instance of the primitive
  if (zodField instanceof zodPrimitive.constructor) {
    return { ok: true, value: zodPrimitive };
  }

  // If the zodField is a ZodOptional, unwrap and check the inner type
  if (zodField instanceof z.ZodOptional) {
    return isZodPrimitiveV2(zodField.unwrap(), zodPrimitive);
  }

  // If the zodField is a ZodNullable, unwrap and check the inner type
  if (zodField instanceof z.ZodNullable) {
    return isZodPrimitiveV2(zodField.unwrap(), zodPrimitive);
  }

  // If the zodField is a ZodEffects, check the inner type
  if (zodField instanceof z.ZodEffects) {
    return isZodPrimitiveV2(zodField.innerType(), zodPrimitive);
  }

  if (zodField instanceof z.ZodDefault) {
    return isZodPrimitiveV2(zodField.removeDefault(), zodPrimitive);
  }

  // If the zodField is a ZodUnion, check if any of its options is the primitive
  if (zodField instanceof z.ZodUnion) {
    for (const option of zodField.options as z.ZodTypeAny[]) {
      const result = isZodPrimitiveV2(option, zodPrimitive);
      if (result.ok) {
        return result;
      }
    }
  }

  // If we reach here, it means the current type is not a wrapper or doesn't match the primitive
  return { ok: false };
}
export function getTargetZodType<T extends z.ZodTypeAny>(
  zodField: unknown,
  zodPrimitive: T
): { ok: true; value: T } | { ok: false } {
  // Check if the zodField is directly an instance of the primitive
  if (zodField instanceof zodPrimitive.constructor) {
    return { ok: true, value: zodField as T };
  }

  // Check if the zodField is a ZodEffects with the inner type being the primitive
  if (
    zodField instanceof z.ZodEffects &&
    zodField.innerType() instanceof zodPrimitive.constructor
  ) {
    return { ok: true, value: zodField.innerType() as T };
  }

  // Check if the zodField is a ZodOptional with the unwrapped type being the primitive
  if (
    zodField instanceof z.ZodOptional &&
    zodField.unwrap() instanceof zodPrimitive.constructor
  ) {
    return { ok: true, value: zodField.unwrap() as T };
  }

  // Check if the zodField is a ZodUnion and any of its options is the primitive
  if (
    zodField instanceof z.ZodUnion &&
    (zodField.options as z.ZodTypeAny[]).some(
      (option) => option instanceof zodPrimitive.constructor
    )
  ) {
    return {
      ok: true,
      value: (zodField.options as z.ZodTypeAny[]).find(
        (f) => f instanceof zodPrimitive.constructor
      ) as T,
    };
  }

  return { ok: false };
}

export const printZodError = (error: z.ZodError) => {
  error.errors.forEach((issue) => {
    if (!issue) return;
    console.log("\x1b[31m\u2717\x1b[0m", `${issue.path.join(".")}:`);
    console.log("\t-", issue.message);
  });
};
