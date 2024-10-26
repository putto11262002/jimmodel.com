import { DB, TX } from "@/db/config";
import { and, eq, inArray } from "drizzle-orm";
import { NotFoundError } from "@/lib/errors";
import _ from "lodash";
import { JsonObject, FileMetadata } from "@/lib/domains";
import { v4 as uuid } from "uuid";
import { fileMetadataTable } from "@/db/schemas";
import { withTransaction } from "../common/helpers/use-transaction";

// Interaction with the underlying file storage
export interface FileStorageStrategy<U extends Readonly<string>> {
  // A unique key that can be used as file path or s3 key. The key is guarantted to be unique.
  upload(file: Blob, hintKey: string): Promise<FileMetadata<any>["key"]>;

  download(key: string): Promise<Blob>;

  delete(key: string): Promise<void>;

  getStorageIdentifier(): U;
}

type ExtractStorageType<T extends ReadonlyArray<FileStorageStrategy<any>>> =
  T[number] extends FileStorageStrategy<infer U> ? U : never;

export class FileUseCase<
  S extends FileStorageStrategy<string> = any,
  T extends Readonly<[S, ...S[]]> = [S],
  U = ExtractStorageType<T>
> {
  private storages: T;
  private defaultStorage: U;
  private db: DB;

  constructor({
    storages,
    defaultStorage,
    db,
  }: {
    storages: T;
    defaultStorage: U;
    db: DB;
  }) {
    this.db = db;
    this.storages = storages;
    if (this.storages.length < 1) throw new Error("No storage provided");
    this.getStorage(
      defaultStorage,
      "Default storage not found in provided storages"
    );

    this.defaultStorage = defaultStorage;
  }

  private getStorage(storageIdentifier: U, notFoundMsg?: string): S {
    const storage = this.storages.find(
      (storage) => storage.getStorageIdentifier() === storageIdentifier
    );
    if (!storage) throw new Error(notFoundMsg || "Storage not found");
    return storage;
  }

  async upload<TMetadata extends JsonObject>(
    file: Blob,
    targetStorage?: U,
    metadata?: FileMetadata<TMetadata>["metadata"],
    tx?: TX
  ): Promise<FileMetadata<TMetadata>> {
    return withTransaction(
      async (tx) => {
        targetStorage = targetStorage || this.defaultStorage;
        const storage = this.getStorage(targetStorage);

        let hintKey: string;
        let existingKey: string | undefined;
        do {
          hintKey = uuid();
          existingKey = await this.db.query.fileMetadataTable
            .findFirst({
              where: eq(fileMetadataTable.key, hintKey),
              columns: { key: true },
            })
            .then((res) => res?.key);
        } while (existingKey);

        const key = await storage.upload(file, hintKey);

        const fileMetadta = await tx
          .insert(fileMetadataTable)
          .values({
            key,
            metadata,
            storageId: storage.getStorageIdentifier(),
            size: file.size,
            mimeType: file.type,
          })
          .returning();
        return fileMetadta[0] as FileMetadata<TMetadata>;
      },
      this.db,
      tx
    );
  }

  async getFileMetadata<T extends JsonObject>(
    fileId: FileMetadata<T>["id"]
  ): Promise<FileMetadata<T> | null> {
    const fileMetadata = await this.db.query.fileMetadataTable.findFirst({
      where: and(
        eq(fileMetadataTable.id, fileId),
        eq(fileMetadataTable.deleted, false)
      ),
    });
    return fileMetadataTable ? (fileMetadata as FileMetadata<T>) : null;
  }

  async getFileMetadatas<T extends JsonObject>(
    fileIds: FileMetadata<T>["id"][]
  ): Promise<FileMetadata<T>[]> {
    const where = and(
      fileIds.length > 0 ? inArray(fileMetadataTable.id, fileIds) : undefined,
      eq(fileMetadataTable.deleted, false)
    );
    const fileMetadatas = await this.db.query.fileMetadataTable.findMany({
      where,
    });
    return fileMetadatas as FileMetadata<T>[];
  }

  async download(fileId: string): Promise<Blob> {
    const fileMetadata = await this.getFileMetadata(fileId);
    if (!fileMetadata) {
      throw new NotFoundError("File not found");
    }
    const storage = this.getStorage(fileMetadata.storageId as U);
    const blob = await storage.download(fileMetadata.key);
    return blob.slice(0, blob.size, fileMetadata.mimeType);
  }

  async updateMetadata<T extends JsonObject>(
    fileId: string,
    metadata: FileMetadata<T>["metadata"]
  ): Promise<void> {
    const updatedRow = await this.db
      .update(fileMetadataTable)
      .set({ metadata })
      .where(
        and(
          eq(fileMetadataTable.id, fileId),
          eq(fileMetadataTable.deleted, false)
        )
      )
      .returning({ id: fileMetadataTable.id });
    if (!updatedRow) {
      throw new NotFoundError("File not found");
    }
  }

  // TODO : cron job to delete files from storage daily
  async delete(fileId: string, tx?: TX): Promise<void> {
    await withTransaction(
      async (tx) => {
        const fileMetadata = await tx
          .update(fileMetadataTable)
          .set({ deleted: true })
          .where(eq(fileMetadataTable.id, fileId))
          .returning()
          .then((res) => res[0]);

        if (!fileMetadata) {
          throw new NotFoundError("File not found");
        }
      },
      this.db,
      tx
    );
  }

  async flushDelete(): Promise<void> {
    const deletdFiles = await this.db.query.fileMetadataTable.findMany({
      where: eq(fileMetadataTable.deleted, true),
    });
    if (deletdFiles.length < 1) return;
    await Promise.all(
      deletdFiles.map(async (file) => {
        const storage = this.getStorage(file.storageId as U);
        await storage.delete(file.key);
      })
    );
    await this.db.delete(fileMetadataTable).where(
      inArray(
        fileMetadataTable.id,
        deletdFiles.map((file) => file.id)
      )
    );
  }
}
