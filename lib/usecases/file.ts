import db from "@/db/client";
import { FileMetadata, fileMetadataTable } from "@/db/schemas/file-metadata";
import { File } from "buffer";
import { v4 as randomUUID } from "uuid";
import { eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { promises as fs } from "fs";
import path from "path";

export default class FileUseCase {
  private path: string;
  private db: PostgresJsDatabase<any>;
  constructor(db: PostgresJsDatabase<any>, path: string) {
    this.path = path;
    this.db = db;
  }

  /**
   * write file to the the file system and return an id that can be used to retrieve the file.
   **/
  public async writeFile(file: File): Promise<FileMetadata> {
    const fileName = randomUUID();
    const filePath = path.join(this.path, `${fileName}`);
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()), {
      flag: "w",
      mode: 0o644,
    });
    const fileMetadata = { path: fileName, mimeType: file.type, id: fileName };
    await this.db.insert(fileMetadataTable).values(fileMetadata);

    return fileMetadata;
  }

  public async readFile(fileId: string): Promise<File> {
    const fileMetadatas = await this.db
      .select()
      .from(fileMetadataTable)
      .where(eq(fileMetadataTable.id, fileId));

    if (fileMetadatas.length < 1) {
      // TODO: custome error
      throw new Error("file not found");
    }

    const fileMetadata = fileMetadatas[0];

    const buffer = await fs.readFile(path.join(this.path, fileMetadata.path));

    const file = new File([buffer], fileMetadata.mimeType);
    return file;
  }

  public async deleteFile(fileId: string): Promise<void> {
    const deleted = await db
      .delete(fileMetadataTable)
      .where(eq(fileMetadataTable.id, fileId))
      .returning();
    if (deleted.length < 1) {
      return;
    }
    await fs.unlink(deleted[0].path);
  }
}

export const fileUseCase = new FileUseCase(db, process.env.FILE_STORAGE_PATH!);
