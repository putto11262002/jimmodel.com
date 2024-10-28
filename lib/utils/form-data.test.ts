import { z } from "zod";
import {
  formDataToObj,
  getValidationSchemaInputFromFormData,
  objToFormData,
} from "./form-data";
import { upperCase } from "lodash";
import { fileValidator } from "./validator";

test("should return correct key values", () => {
  const formData = new FormData();
  formData.append("string", "foo");
  formData.append("file", new File([""], "bar.txt"));
  formData.append("array", "1");
  formData.append("array", "2");
  formData.append("array", "3");

  const expectedOBj = {
    string: "foo",
    file: new File([""], "bar.txt"),
    array: ["1", "2", "3"],
  };
  const obj = formDataToObj(formData);
  expect(obj).toMatchObject(expectedOBj);
});

test("objToFormDat", () => {
  const obj = {
    number: 1,
    string: "foo",
    file: new File([""], "bar.txt"),
    boolean: true,
    null: null,
    stringArray: ["s0", "s1"],
    numberArray: [0, 1],
    booleanArray: [true, false],
    undefined: undefined,
    arrayWithundefined: [undefined, "foo"],
  };
  const expectedFormData = new FormData();
  expectedFormData.append("number", String(1));
  expectedFormData.append("string", "foo");
  expectedFormData.append("file", new File([""], "bar.txt"));
  expectedFormData.append("boolean", String(true));
  expectedFormData.append("null", String(null));
  expectedFormData.append("stringArray", "s0");
  expectedFormData.append("stringArray", "s1");
  expectedFormData.append("numberArray", String(0));
  expectedFormData.append("numberArray", String(1));
  expectedFormData.append("booleanArray", String(true));
  expectedFormData.append("booleanArray", String(false));
  expectedFormData.append("arrayWithundefined", "foo");

  const formData = objToFormData(obj);

  expect(formData.get("number")).toBe(expectedFormData.get("number"));
  expect(formData.get("string")).toBe(expectedFormData.get("string"));
  expect(formData.get("file")).toEqual(expectedFormData.get("file"));
  expect(formData.get("boolean")).toBe(expectedFormData.get("boolean"));
  expect(formData.get("null")).toBe(expectedFormData.get("null"));
  expect(formData.getAll("stringArray")).toEqual(
    expectedFormData.getAll("stringArray")
  );
  expect(formData.getAll("numberArray")).toEqual(
    expectedFormData.getAll("numberArray")
  );
  expect(formData.getAll("booleanArray")).toEqual(
    expectedFormData.getAll("booleanArray")
  );
  expect(formData.has("undefined")).toBe(false);
  expect(formData.getAll("arrayWithundefined")).toEqual(
    expectedFormData.getAll("arrayWithundefined")
  );
});

describe("getValidationSchemaInputFromSearchParamsObj", () => {
  test("Ignore undefined field", () => {
    const schema = z.object({
      foo: z.string(),
    });
    const formData = new FormData();
    const received = getValidationSchemaInputFromFormData(formData, schema, {});
    expect(received.foo).toBeUndefined();
  });

  test('"null -> null', () => {
    const formData = objToFormData({ foo: null });
    const schema = z.object({
      foo: z.string(),
    });
    const received = getValidationSchemaInputFromFormData(formData, schema, {});
    expect(received.foo).toBeNull();
  });

  describe("z.ZodString, z.ZodEnum, z.ZodEffects<z.ZodString>, z.ZodEffects<z.ZodEnum>", () => {
    const input = objToFormData({
      dateString: "2021-01-01T00:00:00Z",
      string: "foo",
      stringTranform: "bar",
      enum: "foo",
    });

    const expected = {
      dateString: "2021-01-01T00:00:00Z",
      string: "foo",
      stringTranform: "bar",
      enum: "foo",
    };

    const arrayInput = objToFormData({
      dateString: ["2021-01-01T00:00:00Z", "_"],
      string: ["foo", "_"],
      stringTranform: ["bar", "_"],
      enum: ["foo", "_"],
    });

    const schema = z.object({
      dateString: z.string().datetime(),
      string: z.string(),
      stringTranform: z.string().transform((v) => upperCase(v)),
      enum: z.enum(["foo", "bar"]),
      enumTransform: z.enum(["foo", "bar"]).transform((v) => upperCase(v)),
    });

    test("string ->", () => {
      const received = getValidationSchemaInputFromFormData(input, schema, {});
      expect(received).toEqual(expected);
    });

    test("string[] ->", () => {
      const received = getValidationSchemaInputFromFormData(
        arrayInput,
        schema,
        {}
      );
      expect(received).toEqual(expected);
    });
  });

  describe("z.ZodNumber, z.ZodEffects<z.ZodNumber>", () => {
    const input = objToFormData({
      integer: "1",
      float: "1.1",
      numberEffect: "1",
      positive: "1",
      undefined: "fooz",
    });

    const arrayInput = objToFormData({
      integer: ["1"],
      float: ["1.1"],
      numberEffect: ["1"],
      positive: ["1"],
      undefined: "fooz",
    });

    const expected = {
      integer: 1,
      float: 1.1,
      numberEffect: 1,
      positive: 1,
      undefined: undefined,
    };

    const schema = z.object({
      integer: z.number(),
      float: z.number(),
      numberEffect: z.number().transform((v) => v + 10),
      positive: z.number().gt(0),
      undefined: z.number(),
    });

    test("string ->", () => {
      const received = getValidationSchemaInputFromFormData(input, schema, {});
      expect(received).toEqual(expected);
    });

    test("string[] ->", () => {
      const received = getValidationSchemaInputFromFormData(
        arrayInput,
        schema,
        {}
      );
      expect(received).toEqual(expected);
    });
  });

  describe("z.ZodBoolean, z.ZodEffects<z.ZodBoolean>", () => {
    const input = objToFormData({
      true: "true",
      false: "false",
      booleanEffect: "true",
      invalid: "fooz",
    });

    const arrayInput = objToFormData({
      true: ["true"],
      false: ["false"],
      booleanEffect: ["true"],
      invalid: ["fooz"],
    });

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
      const received = getValidationSchemaInputFromFormData(input, schema, {});
      expect(received).toEqual(expected);
    });

    test("string[] ->", () => {
      const received = getValidationSchemaInputFromFormData(
        arrayInput,
        schema,
        {}
      );
      expect(received).toEqual(expected);
    });
  });

  describe("z.ZodType<File>, z.ZodEffect<z.ZodType<File>>", () => {
    const schema = z.object({
      foo: z.instanceof(File),
    });

    test("File -> File", () => {
      const file = new File([" "], "foo.txt");
      const received = getValidationSchemaInputFromFormData(
        objToFormData({ foo: file }),
        schema,
        {}
      );
      expect(received.foo).toEqual(file);
    });

    test("File[] -> File[0]", () => {
      const file = new File(["  "], "foo1.txt");
      const input = objToFormData({ foo: [file, new File([" "], "foo2.txt")] });
      const received = getValidationSchemaInputFromFormData(input, schema, {});
      expect(received.foo).toEqual(file);
    });
  });
  describe("z.ZodArray<z.ZodBoolean | z.ZodString | z.ZodNumber | FileValidator>", () => {
    const schema = z.object({
      booleanArray: z.array(z.boolean()),
      stringArray: z.array(z.string()),
      numberArray: z.array(z.number()),
      fileArray: z.array(fileValidator({})),
    });
    const file1 = new File([" "], "foo.txt");
    const file2 = new File([" "], "bar.txt");

    test("string  | File ->", () => {
      const input = objToFormData({
        booleanArray: "true",
        stringArray: "foo",
        numberArray: "12",
        fileArray: file1,
      });

      const expected = {
        booleanArray: [true],
        stringArray: ["foo"],
        numberArray: [12],
        fileArray: [file1],
      };
      const received = getValidationSchemaInputFromFormData(input, schema, {});
      expect(received).toEqual(expected);
    });

    test("string[] ->", () => {
      const input = objToFormData({
        booleanArray: ["true", "false"],
        stringArray: ["foo", "bar"],
        numberArray: ["12", "23"],
        fileArray: [file1, file2],
      });

      const expected = {
        booleanArray: [true, false],
        stringArray: ["foo", "bar"],
        numberArray: [12, 23],
        fileArray: [file1, file2],
      };
      const received = getValidationSchemaInputFromFormData(input, schema, {});
      expect(received).toEqual(expected);
    });
  });
});
