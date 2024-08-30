import { DB } from "@/db";
import { ImageUseCase } from "./image";
import { FileUseCase } from "./file";
import {
  Showcase,
  ShowcaseCreateInput,
  ShowcaseImage,
  ShowcaseImageCreateInput,
  ShowcaseUpdateInput,
} from "../types/showcase";
import {
  showcaseImageTable,
  showcasesToModelsTable,
  showcaseTable,
} from "@/db/schemas/showcase";
import { and, count, eq, sql } from "drizzle-orm";
import { modelProfileColumns } from "./model";
import { PaginatedData } from "../types/paginated-data";
import { getOffset, paginate } from "../utils/pagination";
import { FileInfo } from "../types/file";
import { NotFoundError } from "../errors/not-found-error";
import ConstraintViolationError from "../errors/contrain-violation-error";
import { VideoLinkProcessor } from "../video-link/video-link-processor";

export class ShowcaseUseCase {
  private db: DB;
  private fileUseCase: FileUseCase;
  private imageUseCase: ImageUseCase;
  constructor({
    db,
    fileUseCase,
    imageUseCase,
  }: {
    db: DB;
    fileUseCase: FileUseCase;
    imageUseCase: ImageUseCase;
  }) {
    this.db = db;
    this.fileUseCase = fileUseCase;
    this.imageUseCase = imageUseCase;
  }

  public async createShowcase(
    input: ShowcaseCreateInput,
  ): Promise<{ id: string }> {
    const showcase = await this.db
      .insert(showcaseTable)
      .values(input)
      .returning();

    return {
      id: showcase[0].id,
    };
  }

  public async updateShowcase(
    id: string,
    input: ShowcaseUpdateInput,
  ): Promise<void> {
    const showcase = await this.db.query.showcaseTable.findFirst({
      where: eq(showcaseTable.id, id),
    });
    if (!showcase) {
      throw new NotFoundError("Showcase not found");
    }
    await this.db
      .update(showcaseTable)
      .set(input)
      .where(eq(showcaseTable.id, id));
  }

  public async getShowcaseById(id: string): Promise<Showcase | null> {
    const showcase = await this.db.query.showcaseTable.findFirst({
      where: eq(showcaseTable.id, id),
      with: {
        images: {
          with: {
            file: true,
          },
        },
        coverImage: true,
        showcasesToModels: {
          with: {
            model: {
              columns: modelProfileColumns,
              with: {
                profileImage: true,
              },
            },
          },
        },
      },
    });

    if (!showcase) {
      return null;
    }
    const { showcasesToModels, ...rest } = showcase;

    return {
      ...rest,
      models: showcasesToModels.map(({ model }) => model),
    };
  }

  public async addVideoLink(id: string, url: string) {
    const showcase = await this.db.query.showcaseTable.findFirst({
      where: eq(showcaseTable.id, id),
    });
    if (!showcase) {
      return null;
    }

    const videoLinkProcesser = new VideoLinkProcessor(url);
    await this.db
      .update(showcaseTable)
      .set({
        videoLinks: [
          ...(showcase.videoLinks ? showcase.videoLinks : []),
          videoLinkProcesser.generateIframeSrc(),
        ],
      })
      .where(eq(showcaseTable.id, id));
  }

  public async removeVideoLink(id: string, url: string) {
    const showcase = await this.db.query.showcaseTable.findFirst({
      where: eq(showcaseTable.id, id),
    });
    if (!showcase) {
      return null;
    }
    await this.db
      .update(showcaseTable)
      .set({
        videoLinks: sql`array_remove(${showcaseTable.videoLinks}, ${url})`,
      })
      .where(eq(showcaseTable.id, id));
  }

  public async getShowcases({
    page,
    pageSize,
    published,
  }: {
    published?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedData<Showcase>> {
    const where = and(
      published ? eq(showcaseTable.published, true) : undefined,
    );
    pageSize = pageSize || 10;
    page = page || 1;
    const [showcases, counts] = await Promise.all([
      this.db.query.showcaseTable.findMany({
        where,
        limit: pageSize,
        offset: getOffset(page, pageSize),
        with: {
          coverImage: true,
          images: {
            with: {
              file: true,
            },
          },
          showcasesToModels: {
            with: {
              model: {
                with: {
                  profileImage: true,
                },
              },
            },
          },
        },
      }),
      this.db.select({ count: count() }).from(showcaseTable).where(where),
    ]);
    const paginated = paginate({
      data: showcases.map((showcase) => {
        const { showcasesToModels, ...rest } = showcase;
        return { ...rest, models: showcasesToModels.map(({ model }) => model) };
      }),
      page,
      pageSize,
      total: counts[0].count,
    });
    return paginated;
  }

  public async updateCoverImage(
    id: string,
    input: ShowcaseImageCreateInput,
  ): Promise<void> {
    const showcase = await this.db.query.showcaseTable.findFirst({
      where: eq(showcaseTable.id, id),
      columns: {
        id: true,
      },
    });
    if (!showcase) {
      throw new NotFoundError("Showcase not found");
    }
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
      .update(showcaseTable)
      .set({
        coverImageId: fileInfo.id,
      })
      .where(eq(showcaseTable.id, id));
  }

  public async addImage(id: string, input: ShowcaseImageCreateInput) {
    const showcase = await this.db.query.showcaseTable.findFirst({
      where: eq(showcaseTable.id, id),
      columns: {
        id: true,
      },
    });
    if (!showcase) {
      throw new NotFoundError("Showcase not found");
    }
    let fileInfo: FileInfo;
    if ("fileId" in input) {
      fileInfo = await this.fileUseCase.copy(input.fileId);
    } else {
      fileInfo = await this.fileUseCase.writeFile(input.file);
    }

    const file = await this.fileUseCase.readFile(fileInfo.id);
    const editableImage = await this.imageUseCase.getEditableImage(file);
    const { height, width } = await editableImage.getDimensions();

    await this.fileUseCase.updateFileMetaData(fileInfo.id, {
      height,
      width,
    });

    await this.db.insert(showcaseImageTable).values({
      fileId: fileInfo.id,
      showcaseId: showcase.id,
      height,
      width,
    });
  }

  public async addModel(id: string, modelId: string): Promise<void> {
    await this.db.insert(showcasesToModelsTable).values({
      showcaseId: id,
      modelId: modelId,
    });
  }

  public async publish(id: string): Promise<void> {
    const showcase = await this.db.query.showcaseTable.findFirst({
      where: eq(showcaseTable.id, id),
      with: {
        showcasesToModels: {
          with: {
            model: {
              columns: { published: true },
            },
          },
        },
      },
    });

    if (!showcase) {
      throw new NotFoundError("Showcase not found");
    }

    if (!showcase.coverImageId) {
      throw new ConstraintViolationError(
        "Cover image must be set before publish",
      );
    }

    if (!showcase.showcasesToModels.every(({ model }) => model.published)) {
      throw new ConstraintViolationError(
        "Models must be published before showcase can be published",
      );
    }

    await this.db
      .update(showcaseTable)
      .set({ published: true })
      .where(eq(showcaseTable.id, id));
  }

  public async unpublish(id: string): Promise<void> {
    const showcase = await this.db.query.showcaseTable.findFirst({
      where: eq(showcaseTable.id, id),
    });

    if (!showcase) {
      throw new NotFoundError("Showcase not found");
    }

    await this.db
      .update(showcaseTable)
      .set({ published: false })
      .where(eq(showcaseTable.id, id));
  }
}
