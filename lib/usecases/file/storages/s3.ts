import { FileMetadata } from "@/lib/domains";
import { FileStorageStrategy } from "../usecase";
import * as Minio from "minio";
import { FileNotFoundError } from "../file-not-found-error";

export class S3FileStorageStrategy<U extends Readonly<string>>
  implements FileStorageStrategy<U>
{
  private identifier: U;
  private bucketName: string;
  private client: Minio.Client;
  constructor({
    identifier,
    bucketName,
    client,
  }: {
    identifier: U;
    bucketName: string;
    client: Minio.Client;
  }) {
    this.identifier = identifier;
    this.bucketName = bucketName;
    this.client = client;
  }

  async upload(file: Blob, key: string): Promise<FileMetadata<any>["key"]> {
    // Prevent duplicate file names

    await this.client.putObject(
      this.bucketName,
      key,
      Buffer.from(await file.arrayBuffer()),
      file.size,
      { "Content-Type": file.type }
    );
    return key;
  }

  async download(key: string): Promise<Blob> {
    const stats = await this.client
      .statObject(this.bucketName, key)
      .catch(() => null);
    if (!stats) {
      throw new FileNotFoundError();
    }
    const stream = await this.client.getObject(this.bucketName, key);

    const tempBuf: any[] = [];
    for await (const chunk of stream) {
      tempBuf.push(chunk);
    }

    const buffer = Buffer.concat(tempBuf);

    return new Blob([buffer], { type: stats.metaData["Content-Type"] });
  }

  async delete(key: string): Promise<void> {
    const stats = await this.client
      .statObject(this.bucketName, key)
      .catch(() => null);
    if (!stats) {
      throw new FileNotFoundError();
    }
    await this.client.removeObject(this.bucketName, key);
  }

  getStorageIdentifier(): U {
    return this.identifier;
  }
}
