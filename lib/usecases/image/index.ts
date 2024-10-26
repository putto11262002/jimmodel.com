import sharp from "sharp";
import { FileUseCase } from "../file";
import { _ImageMetadata, ImageMetadata } from "@/lib/domains/types/image";
import { InvalidArgumentError } from "@/lib/errors/invalid-argument-error";
import { DB, TX } from "@/db/config";
import { withTransaction } from "../common/helpers/use-transaction";
import { JsonObject } from "@/lib/domains/types/json";

export class ImageUseCase {
  private db: DB;
  private fileUseCase: FileUseCase<any, any>;
  public static supportedImageFormats = [
    "jpeg",
    "png",
    "webp",
    "jpg",
    "gif",
  ] as const;

  constructor({
    fileUseCase,
    db,
  }: {
    fileUseCase: FileUseCase<any, any>;
    db: DB;
  }) {
    this.fileUseCase = fileUseCase;
    this.db = db;
  }

  public isSupportedImage(file: Blob): boolean {
    return ImageUseCase.supportedImageFormats.includes(
      file.type.split("/")?.[1] as any
    );
  }

  public async upload<T extends JsonObject>(
    image: Blob,
    {
      format,
      resize,
    }: { format?: ImageFormat | null; resize?: ResizeOpts | null } = {},
    metadata?: T,
    tx?: TX
  ): Promise<ImageMetadata<T>> {
    return withTransaction(
      async (tx) => {
        const isSupported = this.isSupportedImage(image);
        if (!isSupported) {
          throw new InvalidArgumentError("Unsupported image format");
        }

        let editableImage = sharp(await image.arrayBuffer());

        const originalImageMetadata = await editableImage.metadata();
        if (resize) {
          editableImage = editableImage.resize({ ...resize, fit: "cover" });
        }

        if (format) {
          editableImage = editableImage.toFormat(format);
        }

        const _metadata: _ImageMetadata<any> = {
          ...(metadata ? metadata : {}),
          width: resize?.width || originalImageMetadata.width!,
          height: resize?.height || originalImageMetadata.height!,
          isImage: true,
        };

        const imageMetadata = await this.fileUseCase.upload(
          new Blob([await editableImage.toBuffer()], {
            type: `image/${format}` || image.type,
          }),
          undefined,
          _metadata,
          tx
        );
        return imageMetadata as ImageMetadata<T>;
      },
      this.db,
      tx
    );
  }

  public async getImageMetadata<T extends JsonObject | undefined>(
    fileId: ImageMetadata["id"]
  ): Promise<ImageMetadata<T> | null> {
    const fileMetadata = await this.fileUseCase.getFileMetadata(fileId);
    return fileMetadata?.metadata.isImage
      ? (fileMetadata as ImageMetadata<T>)
      : null;
  }

  public async getImageMetadatas<T extends JsonObject | undefined>(
    fileIds: ImageMetadata["id"][]
  ): Promise<ImageMetadata<T>[]> {
    const images = await this.fileUseCase.getFileMetadatas(fileIds);
    return images.filter(
      (image) => image.metadata.isImage
    ) as ImageMetadata<T>[];
  }
}

export type ImageFormat = keyof sharp.FormatEnum;
export type ResizeOpts = sharp.ResizeOptions;
