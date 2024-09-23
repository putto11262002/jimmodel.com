import { Model as _Model } from "@/db/schemas";

export type Model = _Model;

export type CompactModel = Pick<
  _Model,
  | "id"
  | "name"
  | "gender"
  | "profileImageId"
  | "dateOfBirth"
  | "published"
  | "category"
  | "bookingStatus"
  | "height"
  | "weight"
  | "hips"
  | "chest"
  | "bust"
  | "hairColor"
  | "eyeColor"
>;
