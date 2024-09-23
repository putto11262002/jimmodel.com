import { Showcase } from "@/lib/domains";
import { FieldsValidationError } from "@/lib/types/validation";

export type PublishValidationError = FieldsValidationError<
  Showcase & { coverImage: string; models: string }
>;
