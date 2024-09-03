import { db } from "@/db/client";
import { DB, TX } from "@/db";
import {
  modelBlockTable,
  modelExperienceTable,
  modelTable,
} from "@/db/schemas/models";
import {
  ModelCategory,
  ModelCreateInput,
  ModelGender,
  ModelImageType,
  ModelUpdateInput,
} from "../types/model";
import {
  ModelBlockWithModelProfile,
  ModelImage,
  ModelProfile,
  ModelProfileImageUpdateInput,
} from "../types/model";
import { and, count, eq, gte, ilike, inArray, lt, lte, or } from "drizzle-orm";
import { PaginatedData } from "../types/paginated-data";
import { modelImageTable } from "../../db/schemas/model-images";
import { getOffset, getPagination } from "../utils/pagination";
import {
  isExistingFile,
  ModelBlock,
  ModelExperienceCreateInput,
} from "../types/model";
import ConstraintViolationError from "../errors/contrain-violation-error";
import { isArray } from "lodash";
import { ModelImageCreateInput } from "../types/model";
import { NotFoundError } from "../errors/not-found-error";
import postgres from "postgres";
import { FileUseCase } from "./file";
import { Gender } from "../types/common";
import { ImageUseCase } from "./image";
import { imageDim } from "@/config/image";
import { FileInfo } from "../types/file";
import dayjs from "dayjs";

export const modelProfileColumns = {
  id: true,
  name: true,
  email: true,
  gender: true,
  dateOfBirth: true,
  active: true,
  published: true,
  inTown: true,
  directBooking: true,
  local: true,
  height: true,
  weight: true,
  chest: true,
  bust: true,
  hips: true,
} as const;

export class ModelUseCase {
  private db: DB;
  private fileUseCase: FileUseCase;
  private imageUseCase: ImageUseCase;
  constructor({
    imageUseCase,
    db,
    fileUseCase,
  }: {
    db: DB;
    imageUseCase: ImageUseCase;
    fileUseCase: FileUseCase;
  }) {
    this.db = db;
    this.fileUseCase = fileUseCase;
    this.imageUseCase = imageUseCase;
  }

  async getModelProfiles({
    page = 1,
    pageSize = 10,
    q,
    ids,
    active,
    published,
    genders,
    local,
    directBooking,
    inTown,
    category,
  }: {
    page?: number;
    pageSize?: number;
    q?: string;
    ids?: string[];
    active?: boolean;
    published?: boolean;
    genders?: Gender[];
    local?: boolean;
    directBooking?: boolean;
    inTown?: boolean;
    category?: ModelCategory;
  }): Promise<PaginatedData<ModelProfile>> {
    const whereClause = and(
      q ? ilike(modelTable.name, `%${q}%`) : undefined,
      ids?.length && ids.length > 0 ? inArray(modelTable.id, ids) : undefined,
      typeof active === "boolean" ? eq(modelTable.active, active) : undefined,
      typeof published === "boolean"
        ? eq(modelTable.published, published)
        : undefined,
      typeof local === "boolean" ? eq(modelTable.local, local) : undefined,
      typeof directBooking === "boolean"
        ? eq(modelTable.directBooking, directBooking)
        : undefined,
      typeof inTown === "boolean" ? eq(modelTable.inTown, inTown) : undefined,
      genders && genders.length > 0
        ? inArray(modelTable.gender, genders)
        : undefined,
      category ? eq(modelTable.category, category) : undefined,
    );

    const [modelProfiles, counts] = await Promise.all([
      db.query.modelTable.findMany({
        columns: modelProfileColumns,
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

    const paginatedData = getPagination(
      modelProfiles.map((modelProfile) => modelProfile),
      page,
      pageSize,
      total,
    );

    return paginatedData;
  }

  /**
   * Retreive a model by id. A model is returned if exist. Otherwise, return null. */
  async getById(modelId: string) {
    const model = await this.db.query.modelTable.findFirst({
      where: eq(modelTable.id, modelId),
      with: {
        profileImage: true,
      },
    });
    if (!model) {
      return null;
    }
    return model;
  }

  private inferModelCategory({
    dateOfBirth: _dateOfBirth,
    gender,
  }: {
    dateOfBirth?: string | null;
    gender: ModelGender;
  }): ModelCategory {
    const dateOfBirth = _dateOfBirth ? dayjs(_dateOfBirth) : null;
    if (
      dateOfBirth &&
      dateOfBirth.isAfter(dayjs().subtract(12, "year"), "day")
    ) {
      return "kids";
    }
    if (
      dateOfBirth &&
      dayjs(dateOfBirth).isBefore(dayjs().subtract(40, "year"), "day")
    ) {
      return "seniors";
    }
    return gender;
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
      .values({
        ...input,
        category: this.inferModelCategory({
          gender: input.gender,
          dateOfBirth: input.dateOfBirth,
        }),
      })
      .returning({ id: modelTable.id });

    return createdModel?.[0];
  }

  /**
   * Update a model by id. If the operation is successful a model id is returned. Otherwise, return null.
   * */
  async updateModel(modelId: string, input: ModelUpdateInput) {
    const model = await this.db.query.modelTable.findFirst({
      where: eq(modelTable.id, modelId),
    });

    if (!model) {
      throw new NotFoundError("Model not found");
    }

    const updatedRows = await this.db
      .update(modelTable)
      .set({
        ...input,
        // If dateOfBirth or gender changes, update the category as well
        ...((input.dateOfBirth && model.dateOfBirth !== input.dateOfBirth) ||
        (input.gender && model.gender !== input.gender)
          ? {
              category: this.inferModelCategory({
                gender: input.gender || model.gender,
                dateOfBirth: input.dateOfBirth || model.dateOfBirth,
              }),
            }
          : {}),
      })
      .where(eq(modelTable.id, modelId))
      .returning({ id: modelTable.id });
    if (updatedRows.length < 1) {
      return null;
    }
    return updatedRows[0].id;
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
  async getBlocksWithModelProfile(
    {
      modelIds,
      start,
      end,
      page = 1,
      pageSize = 10,
      pagination = true,
    }: {
      modelIds?: string[];
      start?: Date;
      end?: Date;
      page?: number;
      pageSize?: number;
      pagination?: boolean;
    } = { page: 1, pageSize: 10, pagination: true },
  ): Promise<PaginatedData<ModelBlockWithModelProfile>> {
    const where = and(
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
    );
    const [blocks, blockCount] = await Promise.all([
      this.db.query.modelBlockTable.findMany({
        where,
        ...(pagination
          ? {
              limit: pageSize,
              offset: getOffset(page, pageSize),
            }
          : {}),
        with: {
          model: {
            columns: modelProfileColumns,
            with: {
              profileImage: true,
            },
          },
        },
      }),

      this.db.select({ count: count() }).from(modelBlockTable),
    ]);

    const paginatedData = getPagination(
      blocks,
      page,
      pageSize,
      blockCount?.[0].count,
    );
    return paginatedData;
  }

  async getBlocks(
    {
      modelIds,
      start,
      end,
      page = 1,
      pageSize = 10,
      pagination = true,
    }: {
      modelIds?: string[];
      start?: Date;
      end?: Date;
      page?: number;
      pageSize?: number;
      pagination?: boolean;
    } = { page: 1, pageSize: 10, pagination: true },
  ): Promise<PaginatedData<ModelBlock>> {
    const where = and(
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
    );
    const [blocks, blockCount] = await Promise.all([
      this.db.query.modelBlockTable.findMany({
        where,
        ...(pagination
          ? {
              limit: pageSize,
              offset: getOffset(page, pageSize),
            }
          : {}),
      }),

      this.db.select({ count: count() }).from(modelBlockTable),
    ]);

    const paginatedData = getPagination(
      blocks,
      page,
      pageSize,
      blockCount?.[0].count,
    );
    return paginatedData;
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

  async updateModelImageType(
    modelId: string,
    fileId: string,
    type: ModelImageType,
  ) {
    await this.db
      .update(modelImageTable)
      .set({ type })
      .where(
        and(
          eq(modelImageTable.modelId, modelId),
          eq(modelImageTable.fileId, fileId),
        ),
      );
  }

  async addModelImage(modelId: string, input: ModelImageCreateInput, tx?: TX) {
    const model = await (tx ? tx : this.db).query.modelTable.findFirst({
      where: eq(modelTable.id, modelId),
    });
    if (!model) {
      throw new Error("Model not found");
    }
    let fileInfo: FileInfo;
    if (isExistingFile(input)) {
      fileInfo = await this.fileUseCase.copy(input.fileId);
    } else {
      fileInfo = await this.fileUseCase.writeFile(input.file);
    }

    const file = await this.fileUseCase.readFile(fileInfo.id);
    const editableImage = await this.imageUseCase.getEditableImage(file);
    const metadata = await editableImage.getMetadata();

    await this.fileUseCase.updateFileMetaData(fileInfo.id, {
      height: metadata.height,
      width: metadata.width,
    });

    await (tx ? tx : this.db).insert(modelImageTable).values({
      type: input.type,
      fileId: fileInfo.id,
      modelId,
    });
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

    await this.db
      .delete(modelImageTable)
      .where(
        and(
          eq(modelImageTable.modelId, modelId),
          eq(modelImageTable.fileId, fileId),
        ),
      );

    try {
      await this.fileUseCase.deleteFile(fileId);
    } catch (err) {
      // Ignore foreign key violation error as the file may still be referenced by the application
      if (err instanceof postgres.PostgresError && err.code === "23503") {
        console.log(err);
        return;
      }
      throw err;
    }
  }

  async updateProfileImage(
    modelId: string,
    input: ModelProfileImageUpdateInput,
    tx?: TX,
  ) {
    const model = await (tx ? tx : this.db).query.modelTable.findFirst({
      where: eq(modelTable.id, modelId),
    });
    if (!model) {
      throw new Error("Model not found");
    }

    const existingProfileId = model.profileImageId;

    let fileInfo: FileInfo;
    if ("fileId" in input) {
      fileInfo = await this.fileUseCase.copy(input.fileId);
    } else {
      fileInfo = await this.fileUseCase.writeFile(input.file);
    }
    const file = await this.fileUseCase.readFile(fileInfo.id);
    const editableImage = await this.imageUseCase.getEditableImage(file);
    const metadata = await editableImage.getMetadata();

    await this.fileUseCase.updateFileMetaData(fileInfo.id, {
      height: metadata.height,
      width: metadata.width,
    });

    await this.db
      .update(modelTable)
      .set({
        profileImageId: fileInfo.id,
      })
      .where(eq(modelTable.id, modelId));

    if (existingProfileId) {
      await this.fileUseCase.deleteFile(existingProfileId);
    }
  }

  async getModelImages(
    modelId: string,
    opts?: { type?: ModelImageType },
  ): Promise<ModelImage[]> {
    const images = await this.db.query.modelImageTable.findMany({
      where: and(
        eq(modelImageTable.modelId, modelId),
        opts?.type ? eq(modelImageTable.type, opts.type) : undefined,
      ),
      with: { file: true },
    });
    return images as ModelImage[];
  }
}
