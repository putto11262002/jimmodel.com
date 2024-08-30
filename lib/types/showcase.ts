import { showcaseTable } from "@/db/schemas/showcase";
import { FileInfo } from "./file";
import { ModelProfile } from "./model";

export type Showcase = {
  id: string;
  title: string;
  description?: string | null;
  coverImageId: string | null;
  coverImage: FileInfo | null;
  videoLinks: string[] | null;
  models: ModelProfile[];
  images: ShowcaseImage[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ShowcaseCreateInput = {
  title: string;
  description?: string | null;
};

export type ShowcaseUpdateInput = Partial<Omit<ShowcaseCreateInput, "name">>;

export type ShowcaseImageCreateInput =
  | {
      file: Blob;
    }
  | { fileId: string };

export type ShowcaseImage = {
  fileId: string;
  file: FileInfo;
  showcaseId: string;
  height: number;
  width: number;
};
