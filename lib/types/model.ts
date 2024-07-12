import { modelBlockTable, modelImageTable, modelTable } from "@/db/schemas";

export type Model = typeof modelTable.$inferSelect & {
  profileImage: ModelImage | null;
};

export type ModelImage = typeof modelImageTable.$inferSelect;

export type ModelCreateInput = Omit<
  typeof modelTable.$inferInsert,
  "profileFileId" | "createdAt" | "updatedAt"
>;

export type ModelUpdateInput = ModelCreateInput;

export type ModelBlock = typeof modelBlockTable.$inferSelect;

export type ModelBlockCreateInput = typeof modelBlockTable.$inferInsert;

export type ModelBlockWithModel = ModelBlock & {
  model: Pick<Model, "name" | "id" | "email" | "profileImage">;
};

