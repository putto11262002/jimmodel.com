import db from "@/db/client";
import {
  ModelCreateInput,
  ModelIamgeType,
  ModelImageCreateInput,
  modelImageTable,
  ModelProfile,
  modelTable,
  ModelUpdateInput,
} from "@/db/schemas/models";
import { count, eq, or } from "drizzle-orm";
import FileService from "./file";
import { File } from "buffer";
import { PaginatedData } from "../types/paginated-data";

const fileUsecase = new FileService(db, process.env.FILE_STORAGE_PATH!);

/**
 * Add new model record. If the operation is successful a model id is returned. Otherwise, return null.
 **/
export const addModel = async (
  input: ModelCreateInput,
): Promise<string | null> => {
  const createdModel = await db
    .insert(modelTable)
    .values(input)
    .returning({ id: modelTable.id });

  if (createdModel.length < 1) {
    return null;
  }

  return createdModel[0].id;
};

/**
 * Retreive a model by id. A model is returned if exist. Otherwise, return null.
 * */
export const findModelById = async (modelId: string) => {
  const model = await db
    .select()
    .from(modelTable)
    .where(eq(modelTable.id, modelId))
    .limit(1);
  if (model.length < 1) {
    return null;
  }
  return model[0];
};

/**
 * Update a model by id. If the operation is successful a model id is returned. Otherwise, return null.
 * */
export const updateModel = async (modelId: string, input: ModelUpdateInput) => {
  const updatedModel = await db
    .update(modelTable)
    .set(input)
    .where(eq(modelTable.id, modelId))
    .returning({ id: modelTable.id });
  if (updatedModel.length < 1) {
    return null;
  }
  return updatedModel[0].id;
};

export const addModelImage = async (
  modelId: string,
  file: File,
  type: ModelIamgeType,
) => {
  const model = await findModelById(modelId);
  if (!model) {
    throw new Error("Model not found");
  }
  const fileMetadata = await fileUsecase.writeFile(file);
  const modelImage: ModelImageCreateInput = {
    fileId: fileMetadata.id,
    modelId: modelId,
    type,
  };
  await db.insert(modelImageTable).values(modelImage);
};

export const findModelProfileById = async (
  modelId: string,
): Promise<ModelProfile | null> => {
  const modelProfiles = await db
    .select({
      id: modelTable.id,
      name: modelTable.name,
      gender: modelTable.gender,
      dateOfBirth: modelTable.dateOfBirth,
    })
    .from(modelTable)
    .where(eq(modelTable.id, modelId))
    .limit(1);

  if (modelProfiles.length < 1) {
    return null;
  }

  return modelProfiles[0];
};

export const getModelProfiles = async ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): Promise<PaginatedData<ModelProfile>> => {
  const whereClause = or();
  const [modelProfiles, counts] = await Promise.all([
    db
      .select({
        id: modelTable.id,
        name: modelTable.name,
        gender: modelTable.gender,
        dateOfBirth: modelTable.dateOfBirth,
      })
      .from(modelTable)
      .where(whereClause)
      .offset((page - 1) * pageSize)
      .limit(pageSize),
    db.select({ count: count() }).from(modelTable).where(whereClause),
  ]);

  const totalPages = Math.ceil(counts[0].count / pageSize);
  const paginatedData: PaginatedData<ModelProfile> = {
    data: modelProfiles,
    totalPages: totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    page,
    pageSize,
  };
  return paginatedData;
};
