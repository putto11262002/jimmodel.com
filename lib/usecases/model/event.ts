import { EventMap } from "@/lib/event-hub";
import {
  ModelBlockCreateInput,
  ModelSettingUpdateInput,
  ModelUpdateInput,
} from "./inputs";
import { ImageMetadata } from "@/lib/domains";
export const MODEL_CREATED = Symbol("model:created");
export const MODEL_UPDATED = Symbol("model:updated");
export const MODEL_PROFILE_IMAGE_UPDATED = Symbol(
  "model:profile-image:updated"
);
export const MODEL_SETTINGS_UPDATED = Symbol("model:settings:updated");
export const MODEL_BLOCK_CREATED_OR_UPDATED = Symbol(
  "model:block:created-or-updated"
);

export interface ModelEventMap extends EventMap {
  MODEL_UPDATED: { modelId: string; data: ModelUpdateInput };
  MODEL_PROFILE_IMAGE_UPDATED: {
    modelId: string;
    imageMetadata: ImageMetadata;
  };
  MODEL_SETTINGS_UPDATED: { modelId: string; data: ModelSettingUpdateInput };
  MODEL_BLOCK_CREATED: {
    modelId: string;
    blockId: string;
    data: ModelBlockCreateInput;
  };
  MODEL_BLOCK_DELETED: { blockId: string };
  MODEL_CREATED: { modelId: string };
}
