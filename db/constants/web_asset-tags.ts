import { generateLabelsMap, generateLabelValuePairs } from "./utils";

export const WEB_ASSET_TAG = {
  HERO: "hero",
} as const;

export const WEB_ASSET_TAGS = [WEB_ASSET_TAG.HERO] as const;

export const WEB_ASSET_TAG_LABELS = generateLabelsMap(WEB_ASSET_TAGS);

export const WEB_ASSET_TAG_LABEL_VALUE_PAIRS =
  generateLabelValuePairs(WEB_ASSET_TAGS);
