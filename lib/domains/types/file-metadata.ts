import { FileMetadata as _FileMetadata } from "@/db/schemas";
import { JsonObject } from "./json";

export type FileMetadata<T extends JsonObject> = Omit<
  _FileMetadata,
  "metadata"
> & { metadata: T };
