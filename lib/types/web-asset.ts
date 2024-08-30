import { webAssetTags, webAssetTypes } from "../constants/web-asset";

export type WebAsset = {
  id: string;
  fileId: string;
  type: WebAssetType; // broad category of asset (e.g. image, video, audio, etc.). It is the type of the mine type
  contentType: string; // mime type
  width?: number | null; // applicable for images
  height?: number | null; // applicable for images
  alt?: string | null; // applicable for images
  published: boolean;
  tag: WebAsseTag;
  createdAt: string;
  updatedAt: string;
};

export type WebAsseTag = (typeof webAssetTags)[number];

export type WebAssetType = (typeof webAssetTypes)[number];

export type WebAssetCreateInput = {
  file: Blob;
  alt?: string;
  tag: WebAsseTag;
};

export type WebAssetUpdateInput = {
  alt?: string | null; 
  tag: WebAsseTag;
};
