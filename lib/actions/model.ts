"use server";
import { ModelImageType } from "@/db/schemas/model-images";
import { ModelCreateInput, ModelUpdateInput } from "@/db/schemas/models";
import { addModel, addModelImage, updateModel } from "../usecases/model";
import { ModelCreateInputSchema, UpdateModelSchema } from "../validators/model";
import { revalidatePath } from "next/cache";
import { File as BufferFile } from "buffer";

export const addModelAction = async (formData: ModelCreateInput) => {
  const result = ModelCreateInputSchema.safeParse(formData);
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
