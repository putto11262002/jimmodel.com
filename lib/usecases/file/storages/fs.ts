import { FileMetadata } from "@/lib/domains";
import { FileStorageStrategy } from "../usecase";
import fs from "node:fs/promises";
import path from "node:path";

export class FSFileStorageStrategy<U extends Readonly<string>>
  implements FileStorageStrategy<U>
{
  private baseDir: string;
  private identifier: U;
  constructor({ baseDir, identifier }: { baseDir: string; identifier: U }) {
    this.baseDir = baseDir;
    this.identifier = identifier;
  }

  async upload(file: Blob, hintKey: string): Promise<FileMetadata<any>["key"]> {
    const fileName = `${new Date().getUTCFullYear()}/${
      Math.random() * 100
    }/${hintKey}`;

    const filePath = path.join(this.baseDir, fileName);
    await fs.mkdir(path.dirname(filePath), { recursive: true, mode: 0o755 });

    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()), {
      flag: "w",
      mode: 0o644,
    });
    return fileName;
  }

  async download(key: string): Promise<Blob> {
    const buffer = await fs.readFile(path.join(this.baseDir, key));

    return new Blob([buffer]);
  }

  async delete(key: string): Promise<void> {
    await fs.unlink(path.join(this.baseDir, key));
  }

  getStorageIdentifier(): U {
    return this.identifier;
  }
}
