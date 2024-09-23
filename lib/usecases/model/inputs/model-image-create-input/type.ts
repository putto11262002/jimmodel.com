import { FileMetadata } from "@/lib/domains/types/file-metadata";
import { ModelImage } from "@/lib/domains/types/model/image";

export type NewModelImageCreateInput = {
  file: Blob;
  type: ModelImage["type"];
};

export type ExistingModelImageCreateInput = {
  fileId: FileMetadata<any>["id"];
  type: ModelImage["type"];
};

export type ModelImageCreateInput =
  | NewModelImageCreateInput
  | ExistingModelImageCreateInput;

export const isExistingImage = (
  input: ModelImageCreateInput
): input is ExistingModelImageCreateInput => {
  return (input as ExistingModelImageCreateInput).fileId !== undefined;
};
