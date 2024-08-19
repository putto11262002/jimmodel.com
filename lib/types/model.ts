import {
  modelBlockTable,
  modelExperienceTable,
  modelImageTable,
  modelImageTypes,
  modelTable,
} from "@/db/schemas";

export type Model = typeof modelTable.$inferSelect & {
  image: ModelImage | null;
};

export type ModelImage = typeof modelImageTable.$inferSelect;

export type ModelCreateInput = Omit<
  typeof modelTable.$inferInsert,
  "profileFileId" | "createdAt" | "updatedAt"
>;

export type ModelUpdateInput = ModelCreateInput;

export type PartialModel = Pick<
  Model,
  "id" | "name" | "gender" | "dateOfBirth"
> & {
  profileImage: {
    fileId: string;
  } | null;
};

export type ModelBlock = typeof modelBlockTable.$inferSelect;

export type ModelBlockWithPartialModel = ModelBlock & {
  model: PartialModel;
};

export type ModelBlockWithModelProfile = ModelBlock & {
  model: ModelProfile;
};

export type ModelBlockCreateInput = typeof modelBlockTable.$inferInsert;

export type ModelBlockWithModel = ModelBlock & {
  model: Pick<Model, "name" | "id" | "email" | "image">;
};

export type ModelExperience = typeof modelExperienceTable.$inferSelect;

export type ModelExperienceCreateInput =
  typeof modelExperienceTable.$inferInsert;

export type ModelImageType = (typeof modelImageTypes)[number];

export type ModelImageCreateInput =
  | { file: Blob; type: ModelImageType }
  | { fileId: string; type: ModelImageType };

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
> & {
  image: {
    fileId: string;
  } | null;
};
