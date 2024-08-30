import { DB } from "@/db";
import { FileUseCase } from "./file";
import { ImageUseCase } from "./image";
import {
  WebAsset,
  WebAsseTag,
  WebAssetCreateInput,
  WebAssetType,
  WebAssetUpdateInput,
} from "../types/web-asset";
import { webAssetTable } from "@/db/schemas";
import { and, count, eq, inArray } from "drizzle-orm";
import { NotFoundError } from "../errors/not-found-error";
import { getOffset, paginate } from "../utils/pagination";

export class WebAssetUseCase {
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

  public async createWebAsset(input: WebAssetCreateInput) {
    const type = input.file.type.split("/")[0];
    let webAsset: Omit<WebAsset, "createdAt" | "updatedAt" | "id">;
    switch (type) {
      case "image": {
        const image = await this.imageUseCase.getEditableImage(input.file);
        const { height, width } = await image.getDimensions();
        const fileInfo = await this.imageUseCase.write(image);
        webAsset = {
          fileId: fileInfo.id,
          type,
          contentType: input.file.type,
          width,
          height,
          alt: input.alt || input.tag,
          tag: input.tag,
          published: false,
        };
        break;
      }
      default: {
        throw new Error(`Unsupported file type: ${type}`);
      }
    }
    const createdWebAsset = await this.db
      .insert(webAssetTable)
      .values(webAsset)
      .returning();
    return createdWebAsset?.[0];
  }

  public async publish(id: string): Promise<void> {
    const webAsset = await this.db.query.webAssetTable.findFirst({
      where: eq(webAssetTable.id, id),
    });
    if (!webAsset) {
      throw new NotFoundError("Web asset not found");
    }
    await this.db
      .update(webAssetTable)
      .set({ published: true })
      .where(eq(webAssetTable.id, id));
  }

  public async unpublish(id: string): Promise<void> {
    const webAsset = await this.db.query.webAssetTable.findFirst({
      where: eq(webAssetTable.id, id),
    });
    if (!webAsset) {
      throw new NotFoundError("Web asset not found");
    }
    await this.db
      .update(webAssetTable)
      .set({ published: false })
      .where(eq(webAssetTable.id, id));
  }

  public async getWebAsset(id: string): Promise<WebAsset | null> {
    const webAsset = await this.db.query.webAssetTable.findFirst({
      where: eq(webAssetTable.id, id),
    });
    if (!webAsset) {
      return null;
    }
    return webAsset;
  }

  public async updateWebAssetMetadata(
    id: string,
    input: WebAssetUpdateInput,
  ): Promise<void> {
    const webAsset = await this.db.query.webAssetTable.findFirst({
      where: eq(webAssetTable.id, id),
    });
    if (!webAsset) {
      throw new NotFoundError("WebAsset not found");
    }
    await this.db
      .update(webAssetTable)
      .set(input)
      .where(eq(webAssetTable.id, id));
  }

  public async removeWebAsset(id: string) {
    const webAsset = await this.db.query.webAssetTable.findFirst({
      where: eq(webAssetTable.id, id),
    });

    if (!webAsset) {
      throw new NotFoundError("Web asset not found");
    }

    await this.db.transaction(async (tx) => {
      await tx.delete(webAssetTable).where(eq(webAssetTable.id, id));
      await this.fileUseCase.deleteFile(webAsset.fileId, tx);
    });
  }

  public async getWebAssets({
    page,
    pageSize,
    tag,
    types,
    published,
  }: {
    page?: number;
    pageSize?: number;
    tag?: WebAsseTag;
    types?: WebAssetType[];
    published?: boolean;
  }) {
    const where = and(
      tag ? eq(webAssetTable.tag, tag) : undefined,
      types && types.length > 0
        ? inArray(webAssetTable.type, types)
        : undefined,
      typeof published === "boolean"
        ? eq(webAssetTable.published, published)
        : undefined,
    );
    pageSize = pageSize || 10;
    page = page || 1;
    const [webAssets, counts] = await Promise.all([
      this.db.query.webAssetTable.findMany({
        where,
        limit: pageSize,
        offset: getOffset(page, pageSize),
      }),
      this.db.select({ count: count() }).from(webAssetTable).where(where),
    ]);
    const paginated = paginate({
      data: webAssets,
      total: counts?.[0].count,
      page,
      pageSize,
    });
    return paginated;
  }
}
