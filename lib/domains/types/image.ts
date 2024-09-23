import { FileMetadata } from "./file-metadata";
import { JsonObject } from "./json";

export type _ImageMetadata<T extends JsonObject | undefined = undefined> = {
  width: number;
  height: number;
  // Field used to indicate that it is created by imageUseCase
  isImage: boolean;
} & (T extends undefined ? {} : T);

export type ImageMetadata<T extends JsonObject | undefined = undefined> =
  FileMetadata<_ImageMetadata<T>>;
