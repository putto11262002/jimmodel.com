"use server";
import {
  ModelCreateInput,
  ModelIamgeType,
  ModelUpdateInput,
} from "@/db/schemas/models";
import { addModel, addModelImage, updateModel } from "../usecases/model";
import { CreateModelSchema, UpdateModelSchema } from "../validators/model";
import { revalidatePath } from "next/cache";
import { File as BufferFile } from "buffer";

export const addModelAction = async (formData: ModelCreateInput) => {
  const result = CreateModelSchema.safeParse(formData);
  if (result.error) {
    // TODO: custome validation error
    throw new Error("invalid model dataj");
  }

  const modelId = await addModel(result.data);
  if (!modelId) {
    throw new Error("failed to add model");
  }
  revalidatePath("/admin/models", "page");
  return modelId;
};

export const updateModelAction = async (
  modelId: string,
  formData: ModelUpdateInput,
) => {
  const result = UpdateModelSchema.safeParse(formData);
  if (result.error) {
    throw new Error("invalid model data");
  }
  const updated = await updateModel(modelId, result.data);
  if (!updated) {
    throw new Error("failed to update model");
  }
  revalidatePath("/admin/models", "page");
  return modelId;
};

export const addModelImageAction = async (
  modelId: string,
  formData: FormData,
) => {
  const type = formData.get("type") as ModelIamgeType;
  const file = formData.get("file") as File;

  await addModelImage(
    modelId,
    new BufferFile([Buffer.from(await file.arrayBuffer())], file.name, {
      type: file.type,
    }),
    type,
  );
  revalidatePath(`/admin/models/upload${modelId}`);
};
