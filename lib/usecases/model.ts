import db, { DB, TX } from "@/db/client";
import {
  modelBlockTable,
  ModelCreateInput,
  modelExperienceTable,
  ModelProfile,
  modelTable,
  ModelUpdateInput,
} from "@/db/schemas/models";
import {
  and,
  count,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  lt,
  lte,
  not,
  or,
} from "drizzle-orm";
import FileUseCase from "./file";
import { PaginatedData } from "../types/paginated-data";
import { ModelImageType, modelImageTable } from "../../db/schemas/model-images";
import { getOffset, getPagination } from "../utils/pagination";
import {
  isExistingFile,
  ModelBlock,
  ModelBlockWithPartialModel,
  ModelExperienceCreateInput,
} from "../types/model";
import { LapTimerIcon } from "@radix-ui/react-icons";
import ConstraintViolationError from "../errors/contrain-violation-error";
import { isArray } from "lodash";
import { FileInfo as FileInfo } from "@/lib/types/file";
import { ModelImageCreateInput } from "../types/model";
import { NotFoundError } from "../errors/not-found-error";

const fileUsecase = new FileUseCase(db, process.env.FILE_STORAGE_PATH!);

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
 * Retreive a model by id. A model is returned if exist. Otherwise, return null. */
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
  file: Blob,
  type: ModelImageType,
) => {
  const model = await findModelById(modelId);
  if (!model) {
    throw new Error("Model not found");
  }
  const fileMetadata = await fileUsecase.writeFile(file);
  await db.insert(modelImageTable).values({
    fileId: fileMetadata.id,
    modelId,
    type,
  });
};

export const getModelImages = async (modelId: string) => {
  const images = await db
    .select()
    .from(modelImageTable)
    .where(eq(modelImageTable.modelId, modelId));
  return images;
};

export const deleteModelImage = async (modelId: string, fileId: string) => {
  await db
    .delete(modelImageTable)
    .where(
      and(
        eq(modelImageTable.modelId, modelId),
        eq(modelImageTable.fileId, fileId),
      ),
    );

  await fileUsecase.deleteFile(fileId);
};

export const setProfileImage = async (modelId: string, fileId: string) => {
  await db
    .update(modelImageTable)
    .set({ isProfile: true })
    .where(
      and(
        eq(modelImageTable.modelId, modelId),
        eq(modelImageTable.fileId, fileId),
      ),
    );

  await db
    .update(modelTable)
    .set({ profileFileId: fileId })
    .where(eq(modelTable.id, modelId));

  await db
    .update(modelImageTable)
    .set({ isProfile: false })
    .where(
      and(
        eq(modelImageTable.modelId, modelId),
        not(eq(modelImageTable.fileId, fileId)),
      ),
    );
};

export const findModelProfileById = async (
  modelId: string,
): Promise<ModelProfile | null> => {
  const modelProfile = await db.query.modelTable.findFirst({
    where: (model, { eq }) => eq(model.id, modelId),
    with: {
      images: {
        columns: {
          fileId: true,
        },
        orderBy: (image, { asc }) => [asc(image.isProfile)],
        limit: 1,
      },
    },
  });
  if (!modelProfile) {
    return null;
  }
  return {
    id: modelProfile.id,
    name: modelProfile.name,
    dateOfBirth: modelProfile?.dateOfBirth,
    gender: modelProfile.gender,
    profileImage: modelProfile?.images?.[0] || null,
  };
};

export const getModels = async ({
  page = 1,
  pageSize = 10,
  q,
  ids,
}: {
  page?: number;
  pageSize?: number;
  q?: string;
  ids?: string[];
}): Promise<PaginatedData<ModelProfile>> => {
  const whereClause = and(
    q ? ilike(modelTable.name, `%${q}%`) : undefined,
    ids?.length && ids.length > 0 ? inArray(modelTable.id, ids) : undefined,
  );

  const [modelProfiles, counts] = await Promise.all([
    db.query.modelTable.findMany({
      where: whereClause,
      with: {
        profileImage: true,
      },
      orderBy: (model, { asc }) => [asc(model.name)],
      limit: pageSize,
      offset: getOffset(page, pageSize),
    }),
    db.select({ count: count() }).from(modelTable).where(whereClause),
  ]);

  const total = counts?.[0]?.count || 0;

  const paginatedData = getPagination(modelProfiles, page, pageSize, total);

  return paginatedData;
};

export const getModelProfiles = async ({
  page = 1,
  pageSize = 10,
  q,
  ids,
}: {
  page?: number;
  pageSize?: number;
  q?: string;
  ids?: string[];
}): Promise<PaginatedData<ModelProfile>> => {
  const whereClause = and(
    q ? ilike(modelTable.name, `%${q}%`) : undefined,
    ids?.length && ids.length > 0 ? inArray(modelTable.id, ids) : undefined,
  );

  const [modelProfiles, counts] = await Promise.all([
    db.query.modelTable.findMany({
      columns: {
        id: true,
        name: true,
        gender: true,
        dateOfBirth: true,
      },
      where: whereClause,
      with: {
        images: {
          columns: {
            fileId: true,
          },
          orderBy: (images, { desc }) => [desc(images.isProfile)],
          limit: 1,
        },
      },
      orderBy: (model, { asc }) => [asc(model.name)],
      limit: pageSize,
      offset: getOffset(page, pageSize),
    }),
    db.select({ count: count() }).from(modelTable).where(whereClause),
  ]);

  const total = counts?.[0]?.count || 0;

  const paginatedData = getPagination(
    modelProfiles.map((modelProfile) => ({
      id: modelProfile.id,
      name: modelProfile.name,
      gender: modelProfile.gender,
      dateOfBirth: modelProfile.dateOfBirth,
      profileImage: modelProfile.images?.[0] || null,
    })),
    page,
    pageSize,
    total,
  );

  return paginatedData;
};

export class ModelUseCase {
  private db: DB;
  constructor(db: DB) {
    this.db = db;
  }

  /**
   * Add new model record. If the operation is successful a model id is returned. Otherwise, return null.
   **/
  public async createModel(
    input: ModelCreateInput,
    tx?: TX,
  ): Promise<{ id: string }> {
    const createdModel = await (tx ? tx : this.db)
      .insert(modelTable)
      .values(input)
      .returning({ id: modelTable.id });

    return createdModel?.[0];
  }

  async getModels({
    page = 1,
    pageSize = 10,
    q,
    ids,
  }: {
    page?: number;
    pageSize?: number;
    q?: string;
    ids?: string[];
  }): Promise<PaginatedData<ModelProfile>> {
    const whereClause = and(
      q ? ilike(modelTable.name, `%${q}%`) : undefined,
      ids?.length && ids.length > 0 ? inArray(modelTable.id, ids) : undefined,
      eq(modelTable.active, true),
    );

    const [modelProfiles, counts] = await Promise.all([
      this.db.query.modelTable.findMany({
        where: whereClause,
        with: {
          profileImage: true,
        },
        orderBy: (model, { asc }) => [asc(model.name)],
        limit: pageSize,
        offset: getOffset(page, pageSize),
      }),
      this.db.select({ count: count() }).from(modelTable).where(whereClause),
    ]);

    const total = counts?.[0]?.count || 0;

    const paginatedData = getPagination(modelProfiles, page, pageSize, total);

    return paginatedData;
  }

  /**
   * Create a blokc for the model from start to end.
   * This date range cannot be ovcerlapping with other blocks, otherwise, an ConflictingError in returned
   * @param modelId
   * @param start start date (inclusive)
   * @param end end state (inclusive)
   */
  async block(
    modelId: string,
    {
      start,
      end,
      reason,
    }: {
      start: Date;
      end: Date;
      reason: string;
    },
  ) {
    const existingBlock = await this.isBlock(modelId, { start, end });
    const blocks = await this.getBlocks({ modelIds: [modelId], start, end });
    console.log(blocks);
    if (existingBlock) {
      throw new ConstraintViolationError(
        `There is already a block between ${start.toUTCString()} to ${end.toUTCString()}`,
      );
    }
    await this.db.insert(modelBlockTable).values({
      modelId,
      start: start.toISOString(),
      end: end.toISOString(),
      reason,
    });
  }

  /**
   * Check if the model is blocked between a given range. If the model is block between the range
   * the block is returned. Otherwise return null
   * @param modelId
   * @param range
   */
  async isBlock(
    modelId: string,
    {
      start,
      end,
    }: {
      start: Date;
      end: Date;
    },
  ): Promise<ModelBlock | null> {
    const block = await this.db.query.modelBlockTable.findFirst({
      where: and(
        or(
          and(
            lt(modelBlockTable.start, start.toISOString()),
            gte(modelBlockTable.end, start.toISOString()),
          ),
          and(
            gte(modelBlockTable.start, start.toISOString()),
            lte(modelBlockTable.start, end.toISOString()),
          ),
        ),
        eq(modelBlockTable.modelId, modelId),
      ),
    });

    if (!block) {
      return null;
    }
    return block;
  }

  async getBlocks({
    modelIds,
    start,
    end,
  }: {
    modelIds?: string[];
    start?: Date;
    end?: Date;
    include?: { model?: boolean | undefined } | undefined;
  }): Promise<ModelBlock[] | ModelBlockWithPartialModel[]>;

  async getBlocks({
    modelIds,
    start,
    end,
    include,
  }: {
    modelIds?: string[];
    start?: Date;
    end?: Date;
    include?: { model?: boolean };
  }): Promise<ModelBlockWithPartialModel[] | ModelBlock[]> {
    const blocks = await this.db.query.modelBlockTable.findMany({
      where: and(
        start && !end
          ? gte(modelBlockTable.start, start.toISOString())
          : undefined,
        end && !start ? lte(modelBlockTable.end, end.toISOString()) : undefined,
        start && end
          ? or(
              and(
                lt(modelBlockTable.start, start.toISOString()),
                gte(modelBlockTable.end, start.toISOString()),
              ),
              and(
                gte(modelBlockTable.start, start.toISOString()),
                lte(modelBlockTable.start, end.toISOString()),
              ),
            )
          : undefined,
        modelIds && modelIds.length > 0
          ? inArray(modelBlockTable.modelId, modelIds)
          : undefined,
      ),
      with: {
        ...(include && include.model
          ? {
              model: {
                columns: {
                  id: true,
                  name: true,
                  email: true,
                },
                with: {
                  profileImage: true,
                },
              },
            }
          : {}),
      },
    });
    return blocks;
  }

  async removeBlock(blockId: string) {
    const deleted = await this.db
      .delete(modelBlockTable)
      .where(eq(modelBlockTable.id, blockId))
      .returning();
    if (deleted.length < 1) {
      throw new Error("Block not found");
    }
    return deleted[0];
  }

  async addExperience(
    modelId: string,
    input: ModelExperienceCreateInput | ModelExperienceCreateInput[],
    tx?: TX,
  ) {
    await (tx ? tx : this.db)
      .insert(modelExperienceTable)
      .values(
        isArray(input)
          ? input.map((i) => ({ ...i, modelId: modelId }))
          : [{ ...input, modelId }],
      );
  }

  async removeExperience(modelId: string, experienceId: string) {
    const deleted = await this.db
      .delete(modelExperienceTable)
      .where(
        and(
          eq(modelExperienceTable.id, experienceId),
          eq(modelExperienceTable.modelId, modelId),
        ),
      )
      .returning();
    return deleted?.[0];
  }

  async getExperiences(modelId: string) {
    const experiences = await this.db.query.modelExperienceTable.findMany({
      where: eq(modelExperienceTable.modelId, modelId),
    });
    return experiences;
  }
  async addModelImage(modelId: string, input: ModelImageCreateInput, tx?: TX) {
    const model = await (tx ? tx : this.db).query.modelTable.findFirst({
      where: eq(modelTable.id, modelId),
    });
    if (!model) {
      throw new Error("Model not found");
    }
    let fileId: string;
    if (isExistingFile(input)) {
      fileId = input.fileId;
    } else {
      const { id } = await fileUsecase.writeFile(input.file);
      fileId = id;
    }

    await db
      .insert(modelImageTable)
      .values({ type: input.type, fileId, modelId });
  }

  async addModelImages(modelId: string, input: ModelImageCreateInput) {
    const model = await this.db.query.modelTable.findFirst({
      where: eq(modelTable.id, modelId),
    });
    if (!model) {
      throw new Error("Model not found");
    }
    let fileId: string;
    if (isExistingFile(input)) {
      fileId = input.fileId;
    } else {
      const { id } = await fileUsecase.writeFile(input.file);
      fileId = id;
    }

    await db
      .insert(modelImageTable)
      .values({ type: input.type, fileId, modelId });
  }

  async removeImage(modelId: string, fileId: string) {
    const modelImage = await this.db.query.modelImageTable.findFirst({
      where: and(
        eq(modelImageTable.modelId, modelId),
        eq(modelImageTable.fileId, fileId),
      ),
    });

    if (!modelImage) {
      throw new NotFoundError("Model image not found");
    }

    if (modelImage.isProfile) {
      throw new ConstraintViolationError("Cannot delete profile image");
    }

    this.db.transaction(async (tx) => {
      await tx
        .delete(modelImageTable)
        .where(
          and(
            eq(modelImageTable.modelId, modelId),
            eq(modelImageTable.fileId, fileId),
          ),
        );

      await fileUsecase.deleteFile(fileId, tx);
    });
  }
}

const modelUseCase = new ModelUseCase(db);

export default modelUseCase;
