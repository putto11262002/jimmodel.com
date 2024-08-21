import {
  modelBlockTable,
  modelExperienceTable,
  modelImageTable,
  modelImageTypes,
  modelTable,
} from "@/db/schemas";
import { FileInfo } from "./file";
import { Gender } from "./common";

export type Model = typeof modelTable.$inferSelect & {
  profileImage: FileInfo | null;
};

export type ModelImage = typeof modelImageTable.$inferSelect & {
  file: Omit<FileInfo, "height" | "width"> & { height: number; width: number };
};

export type ModelCreateInput = Omit<
  typeof modelTable.$inferInsert,
  "createdAt" | "updatedAt"
>;

export type ModelUpdateInput = Omit<ModelCreateInput, "name" | "gender"> & {
  name?: string;
  gender?: Gender;
};

export type ModelBlock = typeof modelBlockTable.$inferSelect;

export type ModelBlockWithModelProfile = ModelBlock & {
  model: ModelProfile;
};

export type ModelBlockCreateInput = typeof modelBlockTable.$inferInsert;

export type ModelBlockWithModel = ModelBlock & {
  model: Model;
};

export type ModelExperience = typeof modelExperienceTable.$inferSelect;

export type ModelExperienceCreateInput =
  typeof modelExperienceTable.$inferInsert;

export type ModelImageType = (typeof modelImageTypes)[number];
export type ModelImageCreateInput =
  | {
      file: Blob;
      type: ModelImageType;
    }
  | { fileId: string; type: ModelImageType };

export type ModelProfileImageUpdateInput = { file: Blob } | { fileId: string };

export const isExistingFile = (
  i: ModelImageCreateInput,
): i is Extract<ModelImageCreateInput, { fileId: string }> =>
  (i as Extract<ModelImageCreateInput, { fileId: string }>).fileId !==
  undefined;

export type ModelProfile = Pick<
  Model,
  | "id"
  | "name"
  | "gender"
  | "dateOfBirth"
  | "published"
  | "active"
  | "inTown"
  | "directBooking"
  | "local"
  | "height"
  | "weight"
  | "hips"
  | "chest"
  | "bust"
  | "profileImage"
>;
