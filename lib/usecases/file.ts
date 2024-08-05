import db, { DB, TX } from "@/db/client";
import { fileInfoTable } from "@/db/schemas/file-metadata";
import { v4 as randomUUID } from "uuid";
import { eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { promises as fs } from "fs";
import path from "path";
import { FileInfo } from "../types/file";
import { newFile } from "../utils/file";
import * as Minio from "minio";
import config from "@/config/global";
/**
 *  FileUseCase assumes that all files supplied are of appropriate size, e.g. not too large to be handled by the server.
 */
export interface FileUseCase {
  writeFile(file: Blob, tx?: TX): Promise<FileInfo>;
  readFile(fileId: string, tx?: TX): Promise<File>;
  deleteFile(fileId: string, tx?: TX): Promise<void>;
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

  public async writeFile(file: Blob, tx?: TX): Promise<FileInfo> {
    const fileName = randomUUID();
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
      })
      .returning();
    return fileInfo[0];
  }

  public async readFile(fileId: string, tx?: TX): Promise<File> {
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

    const file = newFile([buffer], "", { type: fileInfo.mimeType });
    return file;
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

export default class FSFileUseCase {
  private path: string;
  private db: PostgresJsDatabase<any>;
  constructor(db: PostgresJsDatabase<any>, path: string) {
    this.path = path;
    this.db = db;
  }

  /**
   * write file to the the file system and return an id that can be used to retrieve the file.
   **/
  public async writeFile(file: Blob, tx?: TX): Promise<FileInfo> {
    const fileName = randomUUID();
    const filePath = path.join(this.path, `${fileName}`);
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()), {
      flag: "w",
      mode: 0o644,
    });
    const input = { path: fileName, mimeType: file.type, id: fileName };
    const fileInfo = await (tx ? tx : this.db)
      .insert(fileInfoTable)
      .values(input)
      .returning();

    return fileInfo[0];
  }

  public async readFile(fileId: string, tx?: TX): Promise<File> {
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

    const file = newFile([buffer], "", { type: fileMetadata.mimeType });
    return file;
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

const minioClient = new Minio.Client({
  accessKey: config.s3.accessKey,
  secretKey: config.s3.secretKey,
  endPoint: config.s3.endpoint,
  useSSL: false,
  ...(process.env.S3_PORT ? { port: config.s3.port } : {}),
});

export const fileUseCase = new S3FileUseCase(minioClient, db, {
  defaultBucketName: config.s3.bucketName,
});
