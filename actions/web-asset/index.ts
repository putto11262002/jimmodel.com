"use server";
import {
  WebAssetCreateInput,
  WebAssetCreateInputSchema,
} from "@/lib/usecases/web-asset/inputs/web-asset-create-input";
import {
  BaseActionResult,
  ValidationErrorActionResult,
} from "../common/action-result";
import { handleActionError } from "../common/handle-action-error";
import { revalidatePath } from "next/cache";
import routes from "@/config/routes";
import {
  validateOrThrowValidationError,
  validateUUIDOrThrowError,
} from "../common";
import { webAssetUseCase } from "@/config";

export const createWebAssetAction = async (
  _: any,
  formData: FormData
): Promise<
  BaseActionResult | ValidationErrorActionResult<WebAssetCreateInput>
> => {
  try {
    const data = validateOrThrowValidationError(
      formData,
      WebAssetCreateInputSchema
    );
    await webAssetUseCase.createWebAsset(data);
    revalidatePath(routes.admin.website.webAssets.main);
    return { status: "success", message: "Web asset created" };
  } catch (e) {
    return handleActionError(e);
  }
};

export const publishWebAssetAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const id = validateUUIDOrThrowError(formData.get("id"));
    await webAssetUseCase.publish(id);
    revalidatePath(routes.admin.website.webAssets.main);
    revalidatePath(routes.main, "layout");
    return { status: "success", message: "Web asset published" };
  } catch (e) {
    return handleActionError(e);
  }
};

export const unpublishWebAssetAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const id = validateUUIDOrThrowError(formData.get("id"));
    await webAssetUseCase.unpublish(id);
    revalidatePath(routes.admin.website.webAssets.main);
    revalidatePath(routes.main, "layout");
    return { status: "success", message: "Web asset unpublished" };
  } catch (e) {
    return handleActionError(e);
  }
};

export const updateWebAssetAction = async (
  _: any,
  formData: FormData
): Promise<
  BaseActionResult | ValidationErrorActionResult<WebAssetCreateInput>
> => {
  try {
    const id = validateUUIDOrThrowError(formData.get("id"));
    const data = validateOrThrowValidationError(
      formData,
      WebAssetCreateInputSchema
    );

    await webAssetUseCase.updateWebAssetMetadata(id, data);
    revalidatePath(routes.admin.website.webAssets.main);
    return { status: "success", message: "Web asset updated" };
  } catch (e) {
    return handleActionError(e);
  }
};

export const webAssetDeleteAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const id = validateUUIDOrThrowError(formData.get("id"));
    await webAssetUseCase.removeWebAsset(id);
    revalidatePath(routes.admin.website.webAssets.main);
    return { status: "success", message: "Web asset deleted" };
  } catch (e) {
    return handleActionError(e);
  }
};
