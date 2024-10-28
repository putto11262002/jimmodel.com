import {
  showcaseImageTable,
  showcaseLinkTable,
  showcaseModelTable,
  showcaseTable,
  Showcase as _Showcase,
} from "@/db/schemas";
import {
  FileMetadata,
  LeanShowcase,
  Model,
  Showcase,
  ShowcaseLink,
} from "@/lib/domains";
import {
  DEFAULT_GET_SHOWCASES_FILTER,
  GetShowcasesFilter,
  ShowcaseCreateInput,
  ShowcaseImageCreateInput,
  ShowcaseLinkCreateInput,
  ShowcaseUpdateInput,
} from "./inputs";
import { and, count, eq } from "drizzle-orm";
import { ActionNotAllowedError, NotFoundError } from "@/lib/errors";
import { ImageUseCase } from "../image";
import { FileUseCase } from "../file";
import {} from "@/db/schemas";
import { ModelUseCase } from "../model";
import { ValidationError } from "@/lib/errors/validation-error";
import { PaginatedData } from "@/lib/types/paginated-data";
import { getOffset, paginate } from "@/lib/utils/pagination";
import { getOrderDirFn } from "../common/helpers/get-order-dir-fn";
import { PublishValidationError } from "./types/publish-error";
import { videoIframeProcessor } from "@/lib/video-link";
import { DB } from "@/db/config";

export class ShowcaseUseCase {
  private readonly db: DB;
  private readonly ifromVideoProcess = videoIframeProcessor;
  private readonly imageUseCase: ImageUseCase;
  private readonly fileUseCase: FileUseCase;
  private readonly modelUseCase: ModelUseCase;

  constructor({
    db,
    imageUseCase,
    fileUseCase,
    modelUseCase,
  }: {
    db: DB;
    imageUseCase: ImageUseCase;
    fileUseCase: FileUseCase;
    modelUseCase: ModelUseCase;
  }) {
    this.db = db;
    this.imageUseCase = imageUseCase;
    this.fileUseCase = fileUseCase;
    this.modelUseCase = modelUseCase;
  }

  async createShowcase(input: ShowcaseCreateInput): Promise<Showcase["id"]> {
    return this.db
      .insert(showcaseTable)
      .values(input)
      .returning({ id: showcaseTable.id })
      .then((result) => result[0].id);
  }

  async updateShowcase(
    id: Showcase["id"],
    input: ShowcaseUpdateInput
  ): Promise<void> {
    const showcase = await this.getEditableShowcaseOrThrow(id);
    await this.db
      .update(showcaseTable)
      .set(input)
      .where(eq(showcaseTable.id, id));
  }

  async updateCoverImage(
    id: Showcase["id"],
    input: ShowcaseImageCreateInput
  ): Promise<void> {
    const showcase = await this.getEditableShowcaseOrThrow(id);

    const imageMetadata = await this.imageUseCase.upload(input.file, {
      format: "jpeg",
      resize: { width: 300, height: 200, fit: "cover" },
    });

    await this.db
      .update(showcaseTable)
      .set({ coverImageId: imageMetadata.id })
      .where(eq(showcaseTable.id, id));

    if (showcase.coverImageId) {
      await this.fileUseCase.delete(showcase.coverImageId);
    }
  }

  async addImage(
    id: Showcase["id"],
    input: ShowcaseImageCreateInput
  ): Promise<void> {
    const showcase = await this.getEditableShowcaseOrThrow(id);
    const imageMetadata = await this.imageUseCase.upload(input.file, {
      format: "jpeg",
    });
    await this.db.insert(showcaseImageTable).values({
      fileId: imageMetadata.id,
      showcaseId: showcase.id,
      width: imageMetadata.metadata.width,
      height: imageMetadata.metadata.height,
    });
  }

  async removeImage(
    id: Showcase["id"],
    fileId: FileMetadata<any>["id"]
  ): Promise<void> {
    await this.getEditableShowcaseOrThrow(id);
    const deletedImage = await this.db
      .delete(showcaseImageTable)
      .where(
        and(
          eq(showcaseImageTable.showcaseId, id),
          eq(showcaseImageTable.fileId, fileId)
        )
      )
      .returning({ fileId: showcaseImageTable.fileId });
    if (deletedImage.length < 1) {
      throw new NotFoundError("Image not found");
    }
    await this.fileUseCase.delete(deletedImage[0].fileId);
  }

  async addModel(id: Showcase["id"], modelId: Model["id"]): Promise<void> {
    await this.getEditableShowcaseOrThrow(id);
    const model = await this.modelUseCase.getModel(modelId, true);
    if (!model) {
      throw new NotFoundError("Model not found");
    }
    await this.db.insert(showcaseModelTable).values({
      showcaseId: id,
      modelId,
      modelName: model.name,
      modelProfileImage: model.profileImageId,
    });
  }

  async removeModel(id: Showcase["id"], modelId: Model["id"]): Promise<void> {
    await this.getEditableShowcaseOrThrow(id);
    const deletedModel = await this.db
      .delete(showcaseModelTable)
      .where(
        and(
          eq(showcaseModelTable.showcaseId, id),
          eq(showcaseModelTable.modelId, modelId)
        )
      )
      .returning({ modelId: showcaseModelTable.modelId });
    if (deletedModel.length < 1) {
      throw new NotFoundError("Model not found");
    }
  }

  async canPublishShowcase(
    showcase: Showcase
  ): Promise<{ ok: false; errors: PublishValidationError } | { ok: true }> {
    let errors: PublishValidationError = {};
    let ok = true;
    if (!showcase.coverImageId) {
      if (!errors.coverImage) {
        errors.coverImage = [];
      }
      ok = false;
      errors.coverImage.push("Cover image is required.");
    }

    if (showcase.showcaseModels.length < 1) {
      if (!errors.models) {
        errors.models = [];
      }
      ok = false;
      errors.models.push("At least one model is required.");
    }
    const models = await this.modelUseCase
      .getModels({
        modelIds: showcase.showcaseModels
          .map((model) => model.modelId)
          .filter((id) => id !== null),
      })
      .then((result) => result.data);

    const isAllModelsPublished = models.every((model) => model.published);
    if (!isAllModelsPublished) {
      if (!errors.models) {
        errors.models = [];
      }
      ok = false;
      errors.models.push("All models must be published");
    }
    if (ok) {
      return { ok: true };
    }
    return { ok: false, errors };
  }

  async publishShowcase(id: Showcase["id"]): Promise<void> {
    const showcase = await this.getShowcase(id);
    if (!showcase) {
      throw new NotFoundError("Showcase not found");
    }
    if (showcase.published) {
      return;
    }
    const validation = await this.canPublishShowcase(showcase);
    if (validation.ok === false) {
      throw new ValidationError(validation.errors);
    }
    await this.db
      .update(showcaseTable)
      .set({ published: true })
      .where(eq(showcaseTable.id, id));
  }

  async unpublishShowcase(id: Showcase["id"]): Promise<void> {
    const showcase = await this.getShowcase(id);
    if (!showcase) {
      throw new NotFoundError("Showcase not found");
    }
    if (showcase.published === false) {
      return;
    }
    await this.db
      .update(showcaseTable)
      .set({ published: false })
      .where(eq(showcaseTable.id, id));
  }

  async getEditableShowcaseOrThrow(id: Showcase["id"]): Promise<_Showcase> {
    const showcase = await this.db.query.showcaseTable.findFirst({
      where: eq(showcaseTable.id, id),
    });
    if (!showcase) {
      throw new NotFoundError("Showcase not found");
    }
    if (showcase.published) {
      throw new ActionNotAllowedError(
        "Showcase is published and cannot be edited"
      );
    }
    return showcase;
  }

  async showcaseExists(id: Showcase["id"]): Promise<boolean> {
    const showcase = await this.db
      .select({ id: showcaseTable.id })
      .from(showcaseTable)
      .where(eq(showcaseTable.id, id));
    if (showcase.length < 1) {
      return false;
    }
    return true;
  }

  async getShowcase(id: Showcase["id"]): Promise<Showcase | null> {
    const showcase = await this.db.query.showcaseTable.findFirst({
      where: eq(showcaseTable.id, id),
      with: { showcaseImages: true, showcaseModels: true, links: true },
    });
    if (!showcase) {
      return null;
    }
    return showcase;
  }

  async getShowcases({
    page = DEFAULT_GET_SHOWCASES_FILTER.page,
    pageSize = DEFAULT_GET_SHOWCASES_FILTER.pageSize,
    pagination = DEFAULT_GET_SHOWCASES_FILTER.pagination,
    orderBy = DEFAULT_GET_SHOWCASES_FILTER.orderBy,
    orderDir = DEFAULT_GET_SHOWCASES_FILTER.orderDir,
    published,
  }: GetShowcasesFilter): Promise<PaginatedData<Showcase>> {
    const where = and(
      published !== undefined
        ? eq(showcaseTable.published, published)
        : undefined
    );
    const result = await Promise.all([
      this.db.query.showcaseTable.findMany({
        where,
        with: { showcaseImages: true, showcaseModels: true, links: true },
        limit: pagination ? pageSize : 1000,
        offset: pagination ? getOffset(page, pageSize) : 0,
        orderBy: getOrderDirFn(orderDir)(showcaseTable[orderBy]),
      }),
      ...(pagination
        ? [this.db.select({ count: count() }).from(showcaseTable).where(where)]
        : []),
    ]);
    return paginate({
      data: result[0],
      page: pagination ? page : 1,
      pageSize: pagination ? pageSize : result[0].length,
      total: pagination ? result[1][0].count : result[0].length,
    });
  }

  async addLink(
    id: Showcase["id"],
    input: ShowcaseLinkCreateInput
  ): Promise<void> {
    const showcase = await this.getEditableShowcaseOrThrow(id);
    const processedUrl = this.ifromVideoProcess.process(input.url);
    if (!processedUrl) {
      throw new ValidationError({ url: ["Unsupported video link"] });
    }
    await this.db
      .insert(showcaseLinkTable)
      .values({
        showcaseId: showcase.id,
        url: input.url,
        platform: processedUrl.videoSource,
        videoId: processedUrl.videoId,
        iframeSrc: processedUrl.iframeSrc,
      })
      .onConflictDoNothing();
  }

  async removeLink(
    id: Showcase["id"],
    linkId: ShowcaseLink["id"]
  ): Promise<void> {
    const deletedRows = await this.db
      .delete(showcaseLinkTable)
      .where(
        and(
          eq(showcaseLinkTable.showcaseId, id),
          eq(showcaseLinkTable.id, linkId)
        )
      );
    if (deletedRows.length < 1) {
      throw new NotFoundError("Link not found");
    }
  }

  async getLeanShowcase(id: Showcase["id"]): Promise<LeanShowcase | null> {
    const showcase = await this.db.query.showcaseTable.findFirst({
      where: eq(showcaseTable.id, id),
    });
    if (!showcase) {
      return null;
    }
    return showcase;
  }

  async deleteShowcase(id: Showcase["id"]): Promise<void> {
    // images
    //
    // delete files
    //
    // delete showcase
    const showcase = await this.getLeanShowcase(id);
    if (!showcase) {
      throw new NotFoundError("Showcase not found");
    }
    if (showcase.published) {
      throw new ActionNotAllowedError(
        "Showcase is published and cannot be deleted"
      );
    }
    const deletedImages = await this.db
      .delete(showcaseImageTable)
      .where(eq(showcaseImageTable.showcaseId, id))
      .returning({ fileId: showcaseImageTable.fileId });

    await Promise.all(
      deletedImages.map(async (image) => {
        return this.fileUseCase.delete(image.fileId);
      })
    );
    await this.db.delete(showcaseTable).where(eq(showcaseTable.id, id));
  }
}
