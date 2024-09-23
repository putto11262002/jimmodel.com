import {
  modelBlockTable,
  modelExperienceTable,
  modelImageTable,
  modelTable,
  NewModel,
} from "@/db/schemas";
import { DB, TX } from "@/db/config";
import { and, asc, countDistinct, desc, eq, ilike, inArray } from "drizzle-orm";
import { PaginatedData } from "@/lib/types/paginated-data";
import { paginate } from "@/lib/utils/pagination";
import {
  NotFoundError,
  InvalidArgumentError,
  ActionNotAllowedError,
} from "@/lib/errors";
import { FileUseCase } from "../file";
import { ImageUseCase } from "../image";
import dayjs from "dayjs";
import { renderModelProfileSheet } from "./helpers/model-summary-sheet";
import {
  CompactModel,
  Model,
  ModelBlock,
  ModelExperience,
  ImageMetadata,
  ModelImage,
} from "@/lib/domains";
import {
  ModelCreateInput,
  ModelUpdateInput,
  GetModelsFilter,
  ModelBlockCreateInput,
  GetModelBlocksFilter,
  ModelExperienceCreateInput,
  isExistingImage,
  ModelImageCreateInput,
  GetModelImagesFilter,
  GetModelFilter,
  ModelProfileImageInput,
  ModelSettingUpdateInput,
  ModelImageUpdateTypeInput,
} from "./inputs";
import { withPagination } from "../common/helpers/with-pagination";
import { getDateRangeWhere } from "../common/helpers/date-range-where";
import {
  withOptionalTransaction,
  withTransaction,
} from "../common/helpers/use-transaction";
import {} from "./inputs/model-profile-image-input/type";
import { isEmpty } from "@/lib/utils/objects";
import { EventHub } from "@/lib/event-hub";
import { ModelEventMap } from "./event";

export const compactModelColumns: Record<keyof CompactModel, true> = {
  id: true,
  name: true,
  gender: true,
  dateOfBirth: true,
  published: true,
  bookingStatus: true,
  category: true,
  height: true,
  weight: true,
  chest: true,
  bust: true,
  hips: true,
  profileImageId: true,
  hairColor: true,
  eyeColor: true,
};

export const compactModelSelect = {
  id: modelTable.id,
  name: modelTable.name,
  gender: modelTable.gender,
  dateOfBirth: modelTable.dateOfBirth,
  published: modelTable.published,
  bookingStatus: modelTable.bookingStatus,
  category: modelTable.category,
  height: modelTable.height,
  weight: modelTable.weight,
  chest: modelTable.chest,
  bust: modelTable.bust,
  hips: modelTable.hips,
  profileImageId: modelTable.profileImageId,
  hairColor: modelTable.hairColor,
  eyeColor: modelTable.eyeColor,
} as const;

export class ModelUseCase<T extends ModelEventMap = any> {
  private db: DB;
  private fileUseCase: FileUseCase;
  private imageUseCase: ImageUseCase;
  private eventHub?: EventHub<T>;
  constructor({
    imageUseCase,
    db,
    fileUseCase,
    eventHub,
  }: {
    db: DB;
    imageUseCase: ImageUseCase;
    fileUseCase: FileUseCase;
    eventHub?: EventHub<T>;
  }) {
    this.db = db;
    this.fileUseCase = fileUseCase;
    this.imageUseCase = imageUseCase;
    this.eventHub = eventHub;
  }

  public async createModel(
    input: ModelCreateInput,
    tx?: TX
  ): Promise<Model["id"]> {
    return withOptionalTransaction(
      async (db) => {
        const createdModelId = await db
          .insert(modelTable)
          .values({
            ...input,
            category: input.category
              ? input.category
              : this.inferCategory({
                  dateOfBirth: input.dateOfBirth,
                  gender: input.gender,
                }),
          })
          .returning({ id: modelTable.id })
          .then((res) => res[0].id);

        this.eventHub?.emit("MODEL_CREATED", { modelId: createdModelId });
        return createdModelId;
      },
      this.db,
      tx
    );
  }

  public async updateModel(
    modelId: Model["id"],
    input: ModelUpdateInput
  ): Promise<void> {
    if (isEmpty(input)) {
      return;
    }
    const updatedModels = await this.db
      .update(modelTable)
      .set(input)
      .where(eq(modelTable.id, modelId))
      .returning({ id: modelTable.id });
    if (updatedModels.length < 1) {
      throw new NotFoundError("Model not found");
    }
    this.eventHub?.emit("MODEL_UPDATED", { modelId, data: input });
  }

  public async updateModelSettings(
    id: Model["id"],
    input: ModelSettingUpdateInput
  ): Promise<void> {
    const updatedModels = await this.db
      .update(modelTable)
      .set(input)
      .where(eq(modelTable.id, id))
      .returning();
    if (updatedModels.length < 1) {
      throw new NotFoundError("Model not found");
    }
    this.eventHub?.emit("MODEL_SETTINGS_UPDATED", { modelId: id, data: input });
  }

  public async modelExist(modelId: Model["id"], tx?: TX): Promise<boolean> {
    return withOptionalTransaction(
      async (db) => {
        const model = await db.query.modelTable.findFirst({
          where: eq(modelTable.id, modelId),
          columns: { id: true },
        });
        return !!model;
      },
      this.db,
      tx
    );
  }

  getModel(
    modelId: Model["id"],
    compact: false,
    filter?: GetModelsFilter
  ): Promise<Model | null>;

  getModel(
    modelId: Model["id"],
    compact?: true,
    filter?: GetModelsFilter
  ): Promise<CompactModel | null>;

  public async getModel(
    modelId: Model["id"],
    compact: boolean = true,
    filter?: GetModelFilter
  ): Promise<CompactModel | Model | null> {
    const where = and(
      eq(modelTable.id, modelId),
      filter?.published !== undefined
        ? eq(modelTable.published, filter.published)
        : undefined
    );
    const model = await this.db.query.modelTable.findFirst({
      where,
      ...(compact ? { columns: compactModelColumns } : {}),
    });

    if (!model) {
      return null;
    }
    return model;
  }

  getModels(
    args: Extract<GetModelsFilter, { compact?: true }>
  ): Promise<PaginatedData<CompactModel>>;

  getModels(
    args: Extract<GetModelsFilter, { compact: false }>
  ): Promise<PaginatedData<Model>>;

  public async getModels({
    page = 1,
    pageSize = 10,
    pagination = true,
    orderDir = "desc",
    orderBy = "createdAt",
    q,
    published,
    category,
    bookingStatus,
    modelIds,
    compact = true,
  }: GetModelsFilter): Promise<PaginatedData<Model | CompactModel>> {
    const where = and(
      q ? ilike(modelTable.name, `${q}%`) : undefined,
      modelIds && modelIds.length > 0
        ? inArray(modelTable.id, modelIds)
        : undefined,
      typeof published === "boolean"
        ? eq(modelTable.published, published)
        : undefined,
      category ? eq(modelTable.category, category) : undefined,
      bookingStatus ? eq(modelTable.bookingStatus, bookingStatus) : undefined
    );
    const bookingsSelect = (
      compact ? this.db.select(compactModelSelect) : this.db.select()
    )
      .from(modelTable)
      .where(where)
      .orderBy(
        orderDir === "asc"
          ? asc(modelTable[orderBy])
          : desc(modelTable[orderBy])
      )
      .$dynamic();

    // TODO : not sure if this will get exesute here?
    const bookingsCount = this.db
      .select({ count: countDistinct(modelTable.id) })
      .from(modelTable)
      .where(where);

    const result = await Promise.all([
      withPagination(bookingsSelect, { pagination, page, pageSize }),
      ...(pagination ? [bookingsCount.then((res) => res[0].count)] : []),
    ]);

    return paginate({
      data: result[0],
      page: pagination ? page : 0,
      pageSize: pagination ? pageSize : 0,
      total: pagination ? result[1] : 0,
    });
  }

  public async createBlock(
    modelId: string,
    input: ModelBlockCreateInput
  ): Promise<void> {
    const model = await this.getModel(modelId, true);
    if (!model) {
      throw new NotFoundError("Model not found");
    }
    const { data: existingBlocks } = await this.getBlocks({
      modelIds: [modelId],
      start: input.start,
      end: input.end,
      pagination: false,
    });

    if (existingBlocks.length > 0) {
      throw new ActionNotAllowedError(
        "A block already exist between this date range"
      );
    }

    const blockId = await this.db
      .insert(modelBlockTable)
      .values({ ...input, modelId, modelName: model.name })
      .returning({ id: modelBlockTable.id })
      .then((res) => res[0].id);

    this.eventHub?.emit("MODEL_BLOCK_CREATED", {
      modelId,
      blockId,
      data: input,
    });
  }

  public async deleteBlock(blockId: string): Promise<void> {
    const deleted = await this.db
      .delete(modelBlockTable)
      .where(eq(modelBlockTable.id, blockId))
      .returning();
    if (deleted.length < 1) {
      throw new NotFoundError("Block not found");
    }
    this.eventHub?.emit("MODEL_BLOCK_DELETED", { blockId });
  }

  public async getBlocks({
    page = 1,
    pageSize = 20,
    pagination = true,
    modelIds,
    start,
    end,
  }: GetModelBlocksFilter): Promise<PaginatedData<ModelBlock>> {
    const where = and(
      getDateRangeWhere(modelBlockTable.start, modelBlockTable.end, start, end),

      modelIds && modelIds.length > 0
        ? inArray(modelBlockTable.modelId, modelIds)
        : undefined
    );

    const blockSelect = this.db
      .select()
      .from(modelBlockTable)
      .where(where)
      .orderBy(desc(modelBlockTable.createdAt))
      .$dynamic();

    const blockCount = this.db
      .select({ count: countDistinct(modelBlockTable.id) })
      .from(modelBlockTable)
      .where(where);
    const result = await Promise.all([
      withPagination(blockSelect, { pagination, page, pageSize }),
      ...(pagination ? [blockCount.then((res) => res[0].count)] : []),
    ]);

    return paginate({
      data: result[0],
      page: pagination ? page : 0,
      pageSize: pagination ? pageSize : 0,
      total: pagination ? result[1] : 0,
    });
  }

  async addExperience(
    modelId: string,
    input: ModelExperienceCreateInput | ModelExperienceCreateInput[],
    tx?: TX
  ): Promise<void> {
    withTransaction(
      async (db) => {
        const model = await this.modelExist(modelId, db);
        if (!model) {
          throw new NotFoundError("Model not found");
        }

        const _input = Array.isArray(input) ? input : [input];
        if (_input.length < 1) return;

        await db
          .insert(modelExperienceTable)
          .values(_input.map((i) => ({ ...i, modelId })));
      },
      this.db,
      tx
    );
  }

  async removeExperience(experienceId: string): Promise<void> {
    const deleted = await this.db
      .delete(modelExperienceTable)
      .where(eq(modelExperienceTable.id, experienceId))
      .returning({ id: modelExperienceTable.id });

    if (deleted.length < 1) {
      throw new NotFoundError("Experience not found");
    }
  }

  async getModelExperiences(modelId: string): Promise<ModelExperience[]> {
    const experiences = await this.db.query.modelExperienceTable.findMany({
      where: eq(modelExperienceTable.modelId, modelId),
    });
    return experiences;
  }

  public async updateProfileImage(
    modelId: string,
    input: ModelProfileImageInput
  ): Promise<void> {
    const modelExist = await this.getModel(modelId, true);
    if (!modelExist) {
      throw new NotFoundError("Model not found");
    }

    const imageMetadata = await this.imageUseCase.upload(input.file, {
      format: "jpeg",
      resize: { width: 400, height: 600 },
    });

    await this.db
      .update(modelTable)
      .set({ profileImageId: imageMetadata.id })
      .where(eq(modelTable.id, modelId));

    if (modelExist.profileImageId) {
      await this.fileUseCase.delete(modelExist.profileImageId);
    }

    this.eventHub?.emit("MODEL_PROFILE_IMAGE_UPDATED", {
      modelId,
      imageMetadata: imageMetadata,
    });
  }

  async updateModelImageType(
    modelId: Model["id"],
    fileId: ModelImage["fileId"],
    input: ModelImageUpdateTypeInput
  ) {
    const updatedRow = await this.db
      .update(modelImageTable)
      .set(input)
      .where(
        and(
          eq(modelImageTable.modelId, modelId),
          eq(modelImageTable.fileId, fileId)
        )
      )
      .returning();
    if (updatedRow.length < 1) {
      throw new NotFoundError("Model image not found");
    }
  }

  async addModelImage(
    modelId: Model["id"],
    input: ModelImageCreateInput,
    tx?: TX
  ): Promise<ModelImage> {
    return withTransaction(
      async (tx) => {
        const modelExist = await this.modelExist(modelId, tx);
        if (!modelExist) {
          throw new NotFoundError("Model not found");
        }

        let imageMetadata: ImageMetadata;
        if (isExistingImage(input)) {
          const inputImageMetadata = await this.imageUseCase.getImageMetadata(
            input.fileId
          );
          if (!inputImageMetadata) {
            throw new NotFoundError("Image not found");
          }
          const imageBlob = await this.fileUseCase.download(input.fileId);
          imageMetadata = await this.imageUseCase.upload(
            imageBlob,
            { format: "jpeg" },
            undefined,
            tx
          );
        } else {
          imageMetadata = await this.imageUseCase.upload(
            input.file,
            { format: "jpeg" },
            undefined,
            tx
          );
        }

        return tx
          .insert(modelImageTable)
          .values({
            type: input.type,
            fileId: imageMetadata.id,
            width: imageMetadata.metadata.width,
            height: imageMetadata.metadata.height,
            modelId,
          })
          .then((res) => res[0]);
      },
      this.db,
      tx
    );
  }

  // TODO: wrap this in a transaction
  async removeImage(modelId: string, fileId: string) {
    const modelImage = await this.db.query.modelImageTable.findFirst({
      where: and(
        eq(modelImageTable.modelId, modelId),
        eq(modelImageTable.fileId, fileId)
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
          eq(modelImageTable.fileId, fileId)
        )
      );

    await this.fileUseCase.delete(modelImage.fileId);
  }

  async getModelImages(
    modelId: string,
    filter?: GetModelImagesFilter
  ): Promise<ModelImage[]> {
    const images = await this.db.query.modelImageTable.findMany({
      where: and(
        eq(modelImageTable.modelId, modelId),
        filter?.type ? eq(modelImageTable.type, filter.type) : undefined
      ),
    });
    return images;
  }

  async generateModelSummarySheet(
    modelId: string,
    output: WritableStream<any>
  ) {
    const model = await this.getModel(modelId, false);
    if (!model) {
      throw new NotFoundError("Model not found");
    }
    let modelProfileImageBuffer: Buffer | null = null;
    if (model.profileImageId) {
      modelProfileImageBuffer = await this.fileUseCase
        .download(model.profileImageId)
        .then((res) => res.arrayBuffer())
        .then((res) => Buffer.from(res));

      await renderModelProfileSheet(model, modelProfileImageBuffer, output);
    }
  }

  // if age less than 12, category is kids
  // if age more than 40, category is seniors
  // otherwise infer category base on gender
  private inferCategory({
    dateOfBirth,
    gender,
  }: Pick<NewModel, "dateOfBirth" | "gender">): NewModel["category"] {
    if (
      dateOfBirth &&
      dayjs(dateOfBirth).isAfter(dayjs().subtract(12, "year"), "day")
    ) {
      return "kids";
    }

    if (dateOfBirth) {
      const _dateOfBirth = dayjs(dateOfBirth);

      if (_dateOfBirth.isAfter(dayjs().subtract(12, "year"), "day")) {
        return "kids";
      }

      if (_dateOfBirth.isBefore(dayjs().subtract(40, "year"), "day")) {
        return "seniors";
      }
    }
    return gender;
  }
}
