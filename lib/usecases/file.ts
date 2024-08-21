import { DB, TX } from "@/db";
import { fileInfoTable } from "@/db/schemas/file-metadata";
import { v4 as randomUUID } from "uuid";
import { eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { promises as fs } from "fs";
import path from "path";
import { FileInfo } from "../types/file";
import * as Minio from "minio";
import { NotFoundError } from "../errors/not-found-error";
import _ from "lodash";

export type FileMetaData = Partial<
  Pick<FileInfo, "width" | "height" | "orginal">
>;
/**
 *  FileUseCase assumes that all files supplied are of appropriate size, e.g. not too large to be handled by the server.
 */
export interface FileUseCase {
  writeFile(file: Blob, opts?: FileMetaData, tx?: TX): Promise<FileInfo>;
  readFile(fileId: string, tx?: TX): Promise<Blob>;
  deleteFile(fileId: string, tx?: TX): Promise<void>;
  updateFileMetaData(fileId: string, metadata: FileMetaData): Promise<void>;
  copy(fileId: string, tx?: TX): Promise<FileInfo>;
}

type S3FileUseCaseOpts = {
  defaultBucketName: string;
};
export class S3FileUseCase implements FileUseCase {
  private client: Minio.Client;
  private opts: S3FileUseCaseOpts;
  private db: DB;

  constructor(
    client: Minio.Client,
    db: DB,
    opts: { defaultBucketName: string },
  ) {
    this.client = client;
    this.db = db;
    this.opts = opts;
  }
  public async copy(fileId: string, tx?: TX): Promise<FileInfo> {
    const fileInfo = await this.db.query.fileInfoTable.findFirst({
      where: eq(fileInfoTable.id, fileId),
    });
    if (!fileInfo) {
      throw new NotFoundError("file not found");
    }
    const copiedFileName = this.getRandomFileName();
    await this.client.copyObject(
      this.opts.defaultBucketName,
      copiedFileName,
      `${this.opts.defaultBucketName}/${fileInfo.path}`,
    );
    const copiedFileInfo = await this.db
      .insert(fileInfoTable)
      .values({
        ..._.omit(fileInfo, ["id"]),
        id: copiedFileName,
        path: copiedFileName,
      })
      .returning();
    return copiedFileInfo[0];
  }

  public async updateFileMetaData(
    fileId: string,
    metadata: FileMetaData,
  ): Promise<void> {
    await this.db
      .update(fileInfoTable)
      .set(metadata)
      .where(eq(fileInfoTable.id, fileId));
  }

  private getRandomFileName(): string {
    return randomUUID();
  }

  public async writeFile(
    file: Blob,
    opts?: FileMetaData,
    tx?: TX,
  ): Promise<FileInfo> {
    const fileName = this.getRandomFileName();
    await this.client.putObject(
      this.opts.defaultBucketName,
      fileName,
      Buffer.from(await file.arrayBuffer()),
      undefined,
      { "Content-Type": file.type },
    );
    const fileInfo = await (tx ? tx : this.db)
      .insert(fileInfoTable)
      .values({
        path: fileName,
        mimeType: file.type,
        id: fileName,
        size: file.size,
        ...opts,
      })
      .returning();
    return fileInfo[0];
  }

  public async readFile(fileId: string, tx?: TX): Promise<Blob> {
    const rows = await (tx ? tx : this.db)
      .select()
      .from(fileInfoTable)
      .where(eq(fileInfoTable.id, fileId));

    if (rows.length < 1) {
      throw new Error("file not found");
    }

    const fileInfo = rows[0];

    const stream = await this.client.getObject(
      this.opts.defaultBucketName,
      fileInfo.path,
    );

    const tempBuf: any[] = [];
    for await (const chunk of stream) {
      tempBuf.push(chunk);
    }
    const buffer = Buffer.concat(tempBuf);

    return new Blob([buffer], { type: fileInfo.mimeType });
  }

  public async deleteFile(fileId: string, tx?: TX) {
    const deleted = await (tx ? tx : this.db)
      .delete(fileInfoTable)
      .where(eq(fileInfoTable.id, fileId))
      .returning();
    if (deleted.length < 1) {
      return;
    }

    await this.client.removeObject(this.opts.defaultBucketName, fileId);
  }
}

export default class FSFileUseCase implements FileUseCase {
  private path: string;
  private db: DB;
  constructor(db: DB, path: string) {
    this.path = path;
    this.db = db;
  }
  public async updateFileMetaData(
    fileId: string,
    metadata: FileMetaData,
  ): Promise<void> {
    await this.db
      .update(fileInfoTable)
      .set(metadata)
      .where(eq(fileInfoTable.id, fileId));
  }

  public async copy(fileId: string, tx?: TX): Promise<FileInfo> {
    const fileInfo = await this.db.query.fileInfoTable.findFirst({
      where: eq(fileInfoTable.id, fileId),
    });

    if (!fileInfo) {
      throw new NotFoundError("file not found");
    }

    const copiedFileName = this.getRandomFileName();
    await fs.copyFile(
      path.join(this.path, fileInfo.path),
      path.join(this.path, copiedFileName),
    );
    const copiedFileInfo = await this.db
      .insert(fileInfoTable)
      .values({
        ..._.omit(fileInfo, ["id", "createdAt", "updatedAt"]),
        id: copiedFileName,
        path: copiedFileName,
      })
      .returning();
    return copiedFileInfo[0];
  }

  private getRandomFileName(): string {
    return randomUUID();
  }

  /**
   * write file to the the file system and return an id that can be used to retrieve the file.
   **/
  public async writeFile(
    file: Blob,
    opts?: FileMetaData,
    tx?: TX,
  ): Promise<FileInfo> {
    const fileName = this.getRandomFileName();
    const filePath = path.join(this.path, `${fileName}`);
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()), {
      flag: "w",
      mode: 0o644,
    });
    const input = {
      path: fileName,
      mimeType: file.type,
      id: fileName,
      size: file.size,
      ...opts,
    };
    const fileInfo = await (tx ? tx : this.db)
      .insert(fileInfoTable)
      .values(input)
      .returning();

    return fileInfo[0];
  }

  public async readFile(fileId: string, tx?: TX): Promise<Blob> {
    const fileMetadatas = await (tx ? tx : this.db)
      .select()
      .from(fileInfoTable)
      .where(eq(fileInfoTable.id, fileId));

    if (fileMetadatas.length < 1) {
      // TODO: custome error
      throw new Error("file not found");
    }

    const fileMetadata = fileMetadatas[0];

    const buffer = await fs.readFile(path.join(this.path, fileMetadata.path));

    return new Blob([buffer], { type: fileMetadata.mimeType });
  }

  public async deleteFile(fileId: string, tx?: TX): Promise<void> {
    const deleted = await (tx ? tx : this.db)
      .delete(fileInfoTable)
      .where(eq(fileInfoTable.id, fileId))
      .returning();
    if (deleted.length < 1) {
      return;
    }

    await fs.unlink(path.join(this.path, deleted[0].path));
  }
}
