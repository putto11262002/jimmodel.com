import { webAssetUseCase } from "@/config";
import { GetWebAssetsFilter } from "@/lib/usecases/web-asset/inputs/get-web-assets-filter";
import { cache } from "react";

export const getWebAssets = cache(async (filter: GetWebAssetsFilter) => {
  return webAssetUseCase.getWebAssets(filter);
});
