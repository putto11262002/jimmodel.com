import db from "@/db/client";
import { FileMetadata, fileMetadataTable } from "@/db/schemas/file-metadata";
import { File } from "buffer";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { writeFile, readFile } from "fs/promises";
import path from "path";

export default class FileService {
  private path: string;
  private db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase, path: string) {
    this.path = path;
    this.db = db;
  }

  /**
   * write file to the the file system and return an id that can be used to retrieve the file.
   **/
  public async writeFile(file: File): Promise<FileMetadata> {
    console.log(file);
    const fileName = randomUUID();
    const filePath = path.join(
      this.path,
      `${fileName}.${path.extname(file.name)}`,
    );
    await writeFile(filePath, Buffer.from(await file.arrayBuffer()), {
      flag: "w",
      mode: 0o644,
    });
    const fileMetadata = { path: filePath, mimeType: file.type, id: fileName };
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

    const buffer = await readFile(fileMetadata.path);

    const file = new File([buffer], fileMetadata.mimeType);
    return file;
  }
}

export const fileService = new FileService(db, process.env.FILE_STORAGE_PATH!);
