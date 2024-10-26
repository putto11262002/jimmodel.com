import { z } from "zod";
import { fileValidator } from "./validator";

describe("fileValidator", () => {
  test("should return a file instance", () => {
    const result = fileValidator({}).safeParse(
      new File([""], "filename.jpg", { type: "image/jpg" })
    );
    result.success && expect(result.data).toBeInstanceOf(File);
  });

  test("should return an error if invalid object is passed", () => {
    const result = fileValidator({}).safeParse({});
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Invalid file");
  });

  test("should return an error if size exceeds limit", () => {
    const result = fileValidator({ size: 1 }).safeParse(
      new File(["  "], "filename.jpg", { type: "image/jpg" })
    );
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "file size 2 B exceeds limit of 1 B"
    );
  });

  test("should return an error if file type is not supported", () => {
    const result = fileValidator({ mimetypes: ["image/jpg"] }).safeParse(
      new File([""], "filename.txt", { type: "text/txt	" })
    );
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Invalid file type. Sopported file types are: jpg"
    );
  });
});
