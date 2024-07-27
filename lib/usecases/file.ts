import db, { TX } from "@/db/client";
import { fileInfoTable } from "@/db/schemas/file-metadata";
import { v4 as randomUUID } from "uuid";
import { eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { promises as fs } from "fs";
import path from "path";
import { FileInfo } from "../types/file";
import { newFile } from "../utils/file";
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

export const fileUseCase = new FileUseCase(db, process.env.FILE_STORAGE_PATH!);
