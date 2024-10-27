import { z } from "zod";
import { SafeFormDataObject, SafeFormDataValue } from "../types/form-data";
import { FieldsValidationError } from "../types/validation";
import { isZodPrimitive } from "./zod";

export const formDataToObj = (formData: FormData) =>
  Array.from(formData.keys()).reduce<
    Record<string, FormDataEntryValue | FormDataEntryValue[]>
  >((acc, key) => {
    if (!formData.has(key)) {
      return acc;
    }

    if (formData.getAll(key).length > 1) {
      acc[key] = formData.getAll(key);
    } else {
      acc[key] = formData.get(key)!;
    }
    return acc;
  }, {});

export const objToFormData = (obj: SafeFormDataObject) => {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined) return;
    if (Array.isArray(value)) {
      value
        .filter((v) => v !== undefined)
        .forEach((v) => {
          formData.append(key, v instanceof File ? v : String(v));
        });
    } else {
      formData.set(key, value instanceof File ? value : String(value));
    }
  });
  return formData;
};

export type ValidationOptions = {
  emptyString?: "null" | "undefined" | "passthrough";
};

export const validateFormData = <TIn, TOut>(
  formData: FormData,
  schema: z.ZodSchema<TOut, z.ZodTypeDef, TIn>,
  options: ValidationOptions = {
    emptyString: "passthrough",
  }
):
  | { ok: true; data: TOut }
  | { ok: false; fieldErorrs: FieldsValidationError<TIn> } => {
  const input = getValidationSchemaInputFromFormData(formData, schema, options);
  const validation = schema.safeParse(input);
  if (validation.success) {
    return { ok: true, data: validation.data };
  }
  return { ok: false, fieldErorrs: validation.error.flatten().fieldErrors };
};

export const getValidationSchemaInputFromFormData = <T extends z.ZodTypeAny>(
  formData: FormData,
  _schema: T,
  options: ValidationOptions
) => {
  const schema = isZodPrimitive(_schema, z.object({}));

  if (!schema) {
    throw new Error("Schema must be an object schema");
  }
  const input: SafeFormDataObject = {};
  Object.entries(schema.shape).forEach(([key, value]) => {
    let result;

    const singleValue = formData.get(key);
    if (singleValue === null) {
      return;
    }

    const singleValueString =
      typeof singleValue === "string" ? singleValue : undefined;

    const arrayValue = formData.getAll(key);

    if (singleValue === "null") {
      return (input[key] = null);
    }

    result = zodStringInput(singleValueString, value, {
      emptyString: options.emptyString,
    });
    if (result.ok) {
      return (input[key] = result.value);
    }

    result = zodEnumInput(singleValueString, value);
    if (result.ok) {
      return (input[key] = result.value);
    }

    result = zodNumberInput(singleValueString, value);
    if (result.ok) {
      return (input[key] = result.value);
    }
    result = zodBooleanInput(singleValueString, value);
    if (result.ok) {
      return (input[key] = result.value);
    }

    result = zodArrayInput(arrayValue, value, options);
    if (result.ok) {
      return (input[key] = result.value);
    }

    result = otherInput(singleValue, value);
    if (result.ok) {
      return (input[key] = result.value);
    }
  });

  return input;
};

const zodArrayInput = (
  value: (string | File)[],
  zodValidationField: unknown,
  options: ValidationOptions
): { ok: true; value: SafeFormDataValue[] | undefined } | { ok: false } => {
  const result = isZodPrimitive(zodValidationField, z.array(z.any()));
  if (result) {
    const innerZodType = result.element;
    const _value = Array.isArray(value) ? value : [value];
    const arrayInput = _value.map((v) => {
      let result;

      const singleValueString = typeof v === "string" ? v : undefined;

      result = zodStringInput(singleValueString, innerZodType, {
        emptyString: options.emptyString,
      });
      if (result.ok) {
        return result.value;
      }

      result = zodEnumInput(singleValueString, innerZodType);
      if (result.ok) {
        return result.value;
      }

      result = zodNumberInput(singleValueString, innerZodType);
      if (result.ok) {
        return result.value;
      }
      result = zodBooleanInput(singleValueString, innerZodType);
      if (result.ok) {
        return result.value;
      }
      result = otherInput(v, value);
      if (result.ok) {
        return result.value;
      }
    });
    return { ok: true, value: arrayInput.filter((v) => v !== undefined) };
  }
  return { ok: false };
};

const otherInput = (
  value: FormDataEntryValue,
  zodValidationField: unknown
): { ok: true; value: string | File | undefined } | { ok: false } => {
  return { ok: true, value };
};

const zodEnumInput = (
  value: string | undefined,
  zodValidationField: unknown
): { ok: true; value: string | undefined } | { ok: false } => {
  const result = isZodPrimitive(zodValidationField, z.enum([""]));
  if (result) {
    return {
      ok: true,
      value: value ? (value in result.Values ? value : undefined) : undefined,
    };
  }
  return { ok: false };
};

const zodStringInput = (
  value: string | undefined,
  zodValidationField: unknown,
  { emptyString }: Pick<ValidationOptions, "emptyString">
): { ok: true; value: string | undefined | null } | { ok: false } => {
  if (isZodPrimitive(zodValidationField, z.string())) {
    if (emptyString === "null" && value === "") {
      return { ok: true, value: null };
    }
    if (emptyString === "undefined" && value === "") {
      return { ok: true, value: undefined };
    }

    return { ok: true, value: value };
  }
  return { ok: false };
};

const zodNumberInput = (
  value: string | undefined,
  zodValidationField: unknown
): { ok: true; value: number | undefined | string } | { ok: false } => {
  if (isZodPrimitive(zodValidationField, z.number())) {
    return {
      ok: true,
      value: value
        ? /^\d*\.?\d*$/.test(value)
          ? Number(value)
          : value
        : undefined,
    };
  }
  return { ok: false };
};

const zodBooleanInput = (
  value: string | undefined,
  zodValidationField: unknown
): { ok: true; value: boolean | undefined } | { ok: false } => {
  if (isZodPrimitive(zodValidationField, z.boolean())) {
    return {
      ok: true,
      value: value === "true" ? true : value === "false" ? false : undefined,
    };
  }
  return { ok: false };
};
