import { z } from "zod";
import {
  getValidationSchemaInputFromSearchParamsObj,
  objToSearchParamsObj,
  objToURLSearchParams,
  URLSearchParamsToObj,
} from "./search-param";
import { upperCase } from "lodash";

test("objToURLSearchParams", () => {
  // Coerce primitive values to strings
  // should ignore undefined values
  const obj = {
    stringArray: ["foo", "bar"],
    numberArray: [0, 1],
    booleanArray: [true, false],
    partialUndefinedArray: [undefined, "foo", "bar"],
    undefined: undefined,
    number: 1,
    string: "foo",
    boolean: true,
    null: null,
  };

  const searchParam = objToURLSearchParams(obj);
  expect(searchParam.getAll("stringArray")).toEqual(
    expect.arrayContaining(obj.stringArray)
  );
  expect(searchParam.getAll("numberArray")).toEqual(
    expect.arrayContaining(obj.numberArray.map(String))
  );
  expect(searchParam.getAll("booleanArray")).toEqual(
    expect.arrayContaining(obj.booleanArray.map(String))
  );
  expect(searchParam.getAll("partialUndefinedArray")).toEqual(
    expect.arrayContaining(
      obj.partialUndefinedArray.filter((v) => v !== undefined)
    )
  );
  expect(searchParam.get("undefined")).toBeNull();
  expect(searchParam.get("number")).toBe("1");
  expect(searchParam.get("string")).toBe("foo");
  expect(searchParam.get("boolean")).toBe("true");
  expect(searchParam.get("null")).toBe("null");
});

test("objToSearchParamsObj", () => {
  const obj = {
    stringArray: ["foo", "bar"],
    numberArray: [0, 1],
    booleanArray: [true, false],
    partialUndefinedArray: [undefined, "foo", "bar"],
    undefined: undefined,
    number: 1,
    string: "foo",
    boolean: true,
    null: null,
  };
  const searchParamObj = objToSearchParamsObj(obj);

  expect(searchParamObj["stringArray"]).toEqual(obj.stringArray);
  expect(searchParamObj["numberArray"]).toEqual(obj.numberArray.map(String));
  expect(searchParamObj["booleanArray"]).toEqual(obj.booleanArray.map(String));
  expect(searchParamObj["partialUndefinedArray"]).toEqual(
    obj.partialUndefinedArray.filter((v) => v !== undefined)
  );
  expect(searchParamObj["undefined"]).toBeUndefined();
  expect(searchParamObj["number"]).toBe("1");
  expect(searchParamObj["string"]).toBe("foo");
  expect(searchParamObj["boolean"]).toBe("true");
  expect(searchParamObj["null"]).toBe("null");
});

test("URLSearchParamsToObj", () => {
  const searchParams = new URLSearchParams();
  searchParams.append("stringArray", "foo");
  searchParams.append("stringArray", "bar");
  searchParams.append("numberArray", "0");
  searchParams.append("numberArray", "1");
  searchParams.append("booleanArray", "true");
  searchParams.append("booleanArray", "false");
  searchParams.append("string", "foo");
  searchParams.append("number", "1");
  searchParams.append("boolean", "true");
  searchParams.append("null", "null");

  const expectedObj = {
    stringArray: ["foo", "bar"],
    numberArray: ["0", "1"],
    booleanArray: ["true", "false"],
    string: "foo",
    number: "1",
    boolean: "true",
    null: "null",
  };
  const receivedObj = URLSearchParamsToObj(searchParams);

  expect(receivedObj).toEqual(expectedObj);
});

describe("getValidationSchemaInputFromSearchParamsObj", () => {
  test("Ignore undefined field", () => {
    const schema = z.object({
      foo: z.string(),
    });
    const searchParamsObj = {};
    const received = getValidationSchemaInputFromSearchParamsObj(
      searchParamsObj,
      schema
    );
    expect(received.foo).toBeUndefined();
  });

  test('"null -> null', () => {
    const searchParams = {
      foo: "null",
    };
    const schema = z.object({
      foo: z.string(),
    });
    const received = getValidationSchemaInputFromSearchParamsObj(
      searchParams,
      schema
    );
    expect(received.foo).toBeNull();
  });

  describe("z.ZodString, z.ZodEnum, z.ZodEffects<z.ZodString>, z.ZodEffects<z.ZodEnum>", () => {
    const searchParamsObj = {
      dateString: "2021-01-01T00:00:00Z",
      string: "foo",
      stringTranform: "bar",
      enum: "foo",
    };

    const arraySearchParamsObj = {
      dateString: ["2021-01-01T00:00:00Z", "_"],
      string: ["foo", "_"],
      stringTranform: ["bar", "_"],
      enum: ["foo", "_"],
    };

    const schema = z.object({
      dateString: z.string().datetime(),
      string: z.string(),
      stringTranform: z.string().transform((v) => upperCase(v)),
      enum: z.enum(["foo", "bar"]),
      enumTransform: z.enum(["foo", "bar"]).transform((v) => upperCase(v)),
    });

    test("string ->", () => {
      const received = getValidationSchemaInputFromSearchParamsObj(
        searchParamsObj,
        schema
      );
      expect(received).toEqual(searchParamsObj);
    });

    test("string[] ->", () => {
      const received = getValidationSchemaInputFromSearchParamsObj(
        arraySearchParamsObj,
        schema
      );
      expect(received).toEqual(searchParamsObj);
    });
  });

  describe("z.ZodNumber, z.ZodEffects<z.ZodNumber>", () => {
    const searchParamsObj = {
      integer: "1",
      float: "1.1",
      numberEffect: "1",
      positive: "1",
      nan: "fooz",
    };

    const arraySearchParamsObj = {
      integer: ["1"],
      float: ["1.1"],
      numberEffect: ["1"],
      positive: ["1"],
      nan: "fooz",
    };
    const expected = {
      integer: 1,
      float: 1.1,
      numberEffect: 1,
      positive: 1,
      nan: NaN,
    };

    const schema = z.object({
      integer: z.number(),
      float: z.number(),
      numberEffect: z.number().transform((v) => v + 10),
      positive: z.number().gt(0),
      nan: z.number(),
    });

    test("string ->", () => {
      const received = getValidationSchemaInputFromSearchParamsObj(
        searchParamsObj,
        schema
      );
      expect(received).toEqual(expected);
    });

    test("string[] ->", () => {
      const received = getValidationSchemaInputFromSearchParamsObj(
        arraySearchParamsObj,
        schema
      );
      expect(received).toEqual(expected);
    });
  });

  describe("z.ZodBoolean, z.ZodEffects<z.ZodBoolean>", () => {
    const searchParamsObj = {
      true: "true",
      false: "false",
      booleanEffect: "true",
      invalid: "fooz",
    };

    const arraySearchParamsObj = {
      true: ["true"],
      false: ["false"],
      booleanEffect: ["true"],
      invalid: ["fooz"],
    };
    const expected = {
      true: true,
      false: false,
      booleanEffect: true,
      invalid: undefined,
    };

    const schema = z.object({
      true: z.boolean(),
      false: z.boolean(),
      booleanEffect: z.boolean().refine((v) => v, "only true"),
      invalid: z.boolean(),
    });

    test("string ->", () => {
      const received = getValidationSchemaInputFromSearchParamsObj(
        searchParamsObj,
        schema
      );
      expect(received).toEqual(expected);
    });

    test("string[] ->", () => {
      const received = getValidationSchemaInputFromSearchParamsObj(
        arraySearchParamsObj,
        schema
      );
      expect(received).toEqual(expected);
    });
  });

  describe("z.ZodArray<z.ZodBoolean | z.ZodString | z.ZodNumber>", () => {
    const arraySearchParamsObj = {
      booleanArray: ["true", "false"],
      stringArray: ["foo", "bar"],
      numberArray: ["12", "23"],
    };

    const searchParamsObj = {
      booleanArray: "true",
      stringArray: "foo",
      numberArray: "12",
    };

    const expectedArray = {
      booleanArray: [true, false],
      stringArray: ["foo", "bar"],
      numberArray: [12, 23],
    };

    const expected = {
      booleanArray: [true],
      stringArray: ["foo"],
      numberArray: [12],
    };

    const schema = z.object({
      booleanArray: z.array(z.boolean()),
      stringArray: z.array(z.string()),
      numberArray: z.array(z.number()),
    });

    test("string ->", () => {
      const received = getValidationSchemaInputFromSearchParamsObj(
        searchParamsObj,
        schema
      );
      expect(received).toEqual(expected);
    });

    test("string[] ->", () => {
      const received = getValidationSchemaInputFromSearchParamsObj(
        arraySearchParamsObj,
        schema
      );
      expect(received).toEqual(expectedArray);
    });
  });
});
