import sharp from "sharp";
import { FileUseCase } from "./file";
import { TX } from "@/db";
import { FileInfo } from "../types/file";

export class ImageUseCase {
  private fileUseCase: FileUseCase;
  private editableImageFactory: EditableImageFactory;
  public static supportedImageFormats = ["jpeg", "png", "webp", "jpg", "gif"];
  constructor({
    fileUseCase,
    editableImageFactory,
  }: {
    fileUseCase: FileUseCase;
    editableImageFactory: EditableImageFactory;
  }) {
    this.fileUseCase = fileUseCase;
    this.editableImageFactory = editableImageFactory;
  }

  public isSupportedImage(file: Blob): boolean {
    return ImageUseCase.supportedImageFormats.includes(
      file.type.split("/")?.[1],
    );
  }

  public async getEditableImage(file: Blob): Promise<EditableImage> {
    if (!this.isSupportedImage(file)) {
      throw new Error("Unsupported image format");
    }
    return this.editableImageFactory.getEditableImage(file);
  }

  public async write(file: EditableImage, tx?: TX): Promise<FileInfo> {
    const metadata = await file.getMetadata();
    const buffer = await file.toBlob();
    return this.fileUseCase.writeFile(
      new Blob([buffer], { type: `image/${metadata.format}` }),
      { width: metadata.width, height: metadata.height },
      tx,
    );
  }
}

export class EditableImageFactory {
  public async getEditableImage(file: Blob): Promise<EditableImage> {
    const buffer = await file.arrayBuffer();
    return new SharpEditableImage(Buffer.from(buffer));
  }
}

export interface EditableImage {
  resize(resizeOpts: ResizeOpts): EditableImage;
  format(format: ImageFormat): EditableImage;
  getMetadata(): Promise<sharp.Metadata>;
  getDimensions(): Promise<{ width: number; height: number }>;
  toBuffer(): Promise<Buffer>;
  toBlob(): Promise<Blob>;
}
export type ImageFormat = keyof sharp.FormatEnum;
export type ResizeOpts = sharp.ResizeOptions;
export class SharpEditableImage implements EditableImage {
  private sharp: sharp.Sharp;
  private metadataModifed: boolean;
  private metadata: sharp.Metadata | null;
  constructor(image: ArrayBuffer | string) {
    this.sharp = sharp(image);
    this.metadataModifed = false;
    this.metadata = null;
  }

  public resize(resizeOpts: ResizeOpts): EditableImage {
    this.sharp.resize(resizeOpts);
    this.metadataModifed = true;
    return this;
  }

  public async getDimensions(): Promise<{ width: number; height: number }> {
    const metadata = await this.getMetadata();
    const height = metadata.height;
    const width = metadata.width;
    if (height === undefined || width === undefined) {
      throw new Error("Image dimensions are not available");
    }
    return { width, height };
  }

  public format(format: ImageFormat) {
    this.sharp.toFormat(format);
    this.metadataModifed = true;
    return this;
  }

  public toBuffer(): Promise<Buffer> {
    return this.sharp.toBuffer();
  }

  public async getMetadata(): Promise<sharp.Metadata> {
    if (this.metadataModifed) {
      const buf = await this.sharp.toBuffer();
      const _sharp = sharp(buf);
      const updatedMetatdata = await _sharp.metadata();
      this.metadata = updatedMetatdata;
      this.metadataModifed = false;
    }
    if (this.metadata === null) {
      this.metadata = await this.sharp.metadata();
    }
    return this.metadata;
  }

  public async toBlob(): Promise<Blob> {
    const buffer = await this.toBuffer();
    return new Blob([buffer], {});
  }
}
