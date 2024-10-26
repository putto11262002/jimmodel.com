import { DB } from "@/db/config";
import { webAssetTable } from "@/db/schemas";
import { and, arrayOverlaps, count, desc, eq } from "drizzle-orm";
import { NotFoundError } from "@/lib/errors/not-found-error";
import { getOffset, paginate } from "@/lib/utils/pagination";
import { FileUseCase } from "../file";
import { ImageUseCase } from "../image";
import { WebAssetCreateInput } from "./inputs/web-asset-create-input";
import { WebAsset } from "@/lib/domains/types/web-asset";
import { WebAssetUpdateInput } from "./inputs/web-asset-update-input";
import { GetWebAssetsFilter } from "./inputs/get-web-assets-filter";

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

  public async createWebAsset(input: WebAssetCreateInput): Promise<string> {
    const imageMetadata = await this.imageUseCase.upload(
      input.file,
      { format: "jpeg" },
      { tag: input.tag }
    );

    const createdWebAsset = await this.db
      .insert(webAssetTable)
      .values({
        id: imageMetadata.id,
        width: imageMetadata.metadata.width,
        height: imageMetadata.metadata.height,
        alt: input.alt,
        tag: input.tag,
        published: false,
      })
      .returning();
    return createdWebAsset[0].id;
  }

  public async webAssetExists(id: string): Promise<boolean> {
    const webAsset = await this.db.query.webAssetTable.findFirst({
      where: eq(webAssetTable.id, id),
      columns: { id: true },
    });
    return !!webAsset;
  }

  public async publish(id: WebAsset["id"]): Promise<void> {
    const webAssetExist = await this.webAssetExists(id);
    if (!webAssetExist) {
      throw new NotFoundError("Web asset not found");
    }
    await this.db
      .update(webAssetTable)
      .set({ published: true })
      .where(eq(webAssetTable.id, id));
  }

  public async unpublish(id: string): Promise<void> {
    const webAssetExist = await this.webAssetExists(id);
    if (!webAssetExist) {
      throw new NotFoundError("Web asset not found");
    }
    await this.db
      .update(webAssetTable)
      .set({ published: false })
      .where(eq(webAssetTable.id, id));
  }

  public async getWebAsset(id: WebAsset["id"]): Promise<WebAsset | null> {
    const webAsset = await this.db.query.webAssetTable.findFirst({
      where: eq(webAssetTable.id, id),
    });
    if (!webAsset) {
      return null;
    }
    return webAsset;
  }

  public async updateWebAssetMetadata(
    id: WebAsset["id"],
    input: WebAssetUpdateInput
  ): Promise<void> {
    const webAssetExist = await this.webAssetExists(id);
    if (!webAssetExist) {
      throw new NotFoundError("WebAsset not found");
    }
    await this.db
      .update(webAssetTable)
      .set(input)
      .where(eq(webAssetTable.id, id));
  }

  public async removeWebAsset(id: string) {
    const webAsset = await this.webAssetExists(id);

    if (!webAsset) {
      throw new NotFoundError("Web asset not found");
    }

    await this.db.transaction(async (tx) => {
      await tx.delete(webAssetTable).where(eq(webAssetTable.id, id));
      await this.fileUseCase.delete(id, tx);
    });
  }

  public async getWebAssets({
    page = 1,
    pageSize = 20,
    pagination = true,
    tag,
    published,
  }: GetWebAssetsFilter) {
    const where = and(
      tag ? arrayOverlaps(webAssetTable.tag, [tag]) : undefined,
      typeof published === "boolean"
        ? eq(webAssetTable.published, published)
        : undefined
    );
    const result = await Promise.all([
      this.db.query.webAssetTable.findMany({
        where,
        limit: pageSize,
        offset: getOffset(page, pageSize),
        orderBy: desc(webAssetTable.createdAt),
      }),
      ...(pagination
        ? [
            this.db
              .select({ count: count() })
              .from(webAssetTable)
              .where(where)
              .then((res) => res[0].count),
          ]
        : []),
    ]);

    const data = result[0];

    return paginate({
      data: data,
      total: pagination ? result[1] : data.length,
      page: pagination ? page : 1,
      pageSize: pagination ? pageSize : data.length,
    });
  }
}
