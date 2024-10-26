import { z } from "zod";
import {
  SearchParamSafeObject,
  SearchParamSafeValue,
} from "../types/search-param";
import { FieldsValidationError } from "../types/validation";
import { isZodPrimitive } from "./zod";

export const encodeSearchParamValue = (
  v: Exclude<SearchParamSafeValue, undefined>
): string => {
  return String(v);
};

export const objToURLSearchParams = (obj: SearchParamSafeObject) => {
  const searchParms = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v === undefined) {
          return;
        }
        searchParms.append(key, encodeSearchParamValue(v));
      });
    } else {
      searchParms.set(key, encodeSearchParamValue(value));
    }
  });
  return searchParms;
};

export const objToSearchParamsObj = (obj: {
  [key: string]: SearchParamSafeValue | SearchParamSafeValue[];
}) => {
  const searchParamsObj: { [key: string]: string | string[] } = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      // Filter out undefined values and encode the remaining ones
      const encodedValues = value
        .filter((v) => v !== undefined)
        .map((v) => encodeSearchParamValue(v));

      // If there's at least one value, add it as an array in the result object
      if (encodedValues.length > 0) {
        searchParamsObj[key] = encodedValues;
      }
    } else {
      // Add the single value as a string
      searchParamsObj[key] = encodeSearchParamValue(value);
    }
  });

  return searchParamsObj;
};

export const URLSearchParamsToObj = (searchParams: URLSearchParams) => {
  return Array.from(searchParams.keys()).reduce<{
    [key: string]: string | string[];
  }>((acc, key) => {
    if (!searchParams.has(key)) {
      return acc;
    }
    if (searchParams.getAll(key).length > 1) {
      acc[key] = searchParams.getAll(key);
    } else {
      acc[key] = searchParams.get(key) as string;
    }
    return acc;
  }, {});
};

export const validateSearchParamObj = <TIn, TOut>(
  searchParamsObj: Record<string, string | string[]>,
  schema: z.ZodSchema<TOut, z.ZodTypeDef, TIn>
):
  | { ok: true; data: TOut }
  | { ok: false; fieldErorrs?: FieldsValidationError<TIn> } => {
  const input = getValidationSchemaInputFromSearchParamsObj(
    searchParamsObj,
    schema
  );
  const validation = schema.safeParse(input);
  if (validation.success) {
    return { ok: true, data: validation.data };
  }
  return { ok: false, fieldErorrs: validation.error.flatten().fieldErrors };
};

export const getValidationSchemaInputFromSearchParamsObj = <
  T extends z.ZodTypeAny
>(
  searchParamsObj: Record<string, string | string[]>,
  _schema: T
) => {
  const schema = isZodPrimitive(_schema, z.object({}));
  if (!schema) {
    throw new Error("Schema must be an object schema");
  }
  const input: SearchParamSafeObject = {};
  Object.entries(schema.shape).forEach(([key, value]) => {
    const searchParamValue = searchParamsObj[key];

    let result;
    if (!searchParamValue) {
      return (input[key] = undefined);
    }

    if (searchParamValue === "null") {
      return (input[key] = null);
    }

    // TODO: Order matters as we could get union types

    result = zodStringInput(searchParamValue, value);
    if (result.ok) {
      return (input[key] = result.value);
    }

    result = zodEnumInput(searchParamValue, value);
    if (result.ok) {
      return (input[key] = result.value);
    }

    result = zodNumberInput(searchParamValue, value);
    if (result.ok) {
      return (input[key] = result.value);
    }
    result = zodBooleanInput(searchParamValue, value);
    if (result.ok) {
      return (input[key] = result.value);
    }

    result = zodArrayInput(searchParamValue, value);
    if (result.ok) {
      return (input[key] = result.value);
    }

    input[key] == searchParamValue;
  });

  return input;
};

const zodArrayInput = (
  value: string | string[],
  zodValidationField: unknown
):
  | { ok: true; value: (string | number | boolean)[] | undefined }
  | { ok: false } => {
  const result = isZodPrimitive(zodValidationField, z.array(z.any()));
  let innerZodType: unknown;

  if (result) {
    innerZodType = result?.element;
    const _value = Array.isArray(value) ? value : [value];
    const arrayInput = _value.map((v) => {
      let result;
      result = zodStringInput(v, innerZodType);
      if (result.ok) {
        return result.value;
      }

      result = zodEnumInput(v, innerZodType);
      if (result.ok) {
        return result.value;
      }

      result = zodNumberInput(v, innerZodType);
      if (result.ok) {
        return result.value;
      }
      result = zodBooleanInput(v, innerZodType);
      if (result.ok) {
        return result.value;
      }
    });
    return { ok: true, value: arrayInput.filter((v) => v !== undefined) };
  }
  return { ok: false };
};

const zodEnumInput = (
  value: string | string[],
  zodValidationField: unknown
): { ok: true; value: string | undefined } | { ok: false } => {
  if (isZodPrimitive(zodValidationField, z.enum([""]))) {
    return { ok: true, value: Array.isArray(value) ? value?.[0] : value };
  }
  return { ok: false };
};
const zodStringInput = (
  value: string | string[],
  zodValidationField: unknown
): { ok: true; value: string | undefined } | { ok: false } => {
  if (isZodPrimitive(zodValidationField, z.string())) {
    return { ok: true, value: Array.isArray(value) ? value?.[0] : value };
  }
  return { ok: false };
};

const zodNumberInput = (
  value: string | string[],
  zodValidationField: unknown
): { ok: true; value: number | undefined } | { ok: false } => {
  if (isZodPrimitive(zodValidationField, z.number())) {
    return {
      ok: true,
      value: Array.isArray(value) ? Number(value?.[0]) : Number(value),
    };
  }
  return { ok: false };
};

const zodBooleanInput = (
  value: string | string[],
  zodValidationField: unknown
): { ok: true; value: boolean | undefined } | { ok: false } => {
  if (isZodPrimitive(zodValidationField, z.boolean())) {
    const _value = Array.isArray(value) ? value?.[0] : value;

    return {
      ok: true,
      value: _value === "true" ? true : _value === "false" ? false : undefined,
    };
  }
  return { ok: false };
};
