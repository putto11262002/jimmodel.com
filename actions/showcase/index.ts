"use server";

import {
  ShowcaseCreateInput,
  ShowcaseCreateInputSchema,
  ShowcaseImageCreateInput,
  ShowcaseImageCreateInputSchema,
  ShowcaseLinkCreateInput,
  ShowcaseLinkCreateInputSchema,
  ShowcaseUpdateInput,
  ShowcaseUpdateInputSchema,
} from "@/lib/usecases";
import {
  BaseActionResult,
  ValidationErrorActionResult,
  handleActionError,
  handleActionErrorWithValidation,
  validateOrThrowValidationError,
  validateUUIDOrThrowError,
} from "../common";
import { revalidatePath, revalidateTag } from "next/cache";
import routes from "@/config/routes";
import { redirect } from "next/navigation";
import { Showcase } from "@/lib/domains";
import { showcaseUseCase } from "@/config";

export const createShowcaseAction = async (
  _: any,
  formData: FormData
): Promise<
  BaseActionResult | ValidationErrorActionResult<ShowcaseCreateInput>
> => {
  try {
    const data = validateOrThrowValidationError(
      formData,
      ShowcaseCreateInputSchema
    );
    const showcaseId = await showcaseUseCase.createShowcase(data);
    revalidateTag(routes.admin.website.showcases.main);
    redirect(
      routes.admin.website.showcases["[id]"].edit.main({ id: showcaseId })
    );
  } catch (e) {
    return handleActionError(e);
  }
};

export const upodateShowcaseAction = async (
  _: any,
  formData: FormData
): Promise<
  BaseActionResult | ValidationErrorActionResult<ShowcaseUpdateInput>
> => {
  try {
    const id = validateUUIDOrThrowError(formData.get("id"));
    const data = validateOrThrowValidationError(
      formData,
      ShowcaseUpdateInputSchema
    );
    await showcaseUseCase.updateShowcase(id, data);
    revalidatePath(routes.admin.website.showcases.main, "layout");
    return {
      status: "success",
      message: "Showcase updated",
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const createShowcaseModelAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const id = validateUUIDOrThrowError(formData.get("id"));
    const modelId = validateUUIDOrThrowError(
      formData.get("modelId"),
      "Invalid Model ID"
    );
    await showcaseUseCase.addModel(id, modelId);
    revalidatePath(
      routes.admin.website.showcases["[id]"].edit.main({ id }),
      "layout"
    );
    return {
      status: "success",
      message: "Model added",
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const deleteShowcaseModelAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const id = validateUUIDOrThrowError(formData.get("id"));

    const modelId = validateUUIDOrThrowError(
      formData.get("modelId"),
      "Invalid Model ID"
    );

    await showcaseUseCase.removeModel(id, modelId);
    revalidatePath(
      routes.admin.website.showcases["[id]"].edit.main({ id }),
      "layout"
    );
    return {
      status: "success",
      message: "Model removed",
    };
  } catch (e) {
    return handleActionError(e);
  }
};
export const createShowcaseImageAction = async (
  _: any,
  formData: FormData
): Promise<
  BaseActionResult | ValidationErrorActionResult<ShowcaseImageCreateInput>
> => {
  try {
    const id = validateUUIDOrThrowError(formData.get("id"));
    const data = validateOrThrowValidationError(
      formData,
      ShowcaseImageCreateInputSchema
    );

    await showcaseUseCase.addImage(id, data);
    revalidatePath(
      routes.admin.website.showcases["[id]"].edit.main({ id }),
      "layout"
    );
    return {
      status: "success",
      message: "Showcase image added",
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const updateShowcaseCoverImageAction = async (
  _: any,
  formData: FormData
): Promise<
  BaseActionResult | ValidationErrorActionResult<ShowcaseImageCreateInput>
> => {
  try {
    const id = validateUUIDOrThrowError(formData.get("id"));
    const data = validateOrThrowValidationError(
      formData,
      ShowcaseImageCreateInputSchema
    );
    await showcaseUseCase.updateCoverImage(id, data);
    revalidatePath(
      routes.admin.website.showcases["[id]"].edit.main({ id }),
      "layout"
    );
    return {
      status: "success",
      message: "Showcase cover image updated",
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const publishShowcaseAction = async (
  _: any,
  formData: FormData
): Promise<
  | BaseActionResult
  | ValidationErrorActionResult<Showcase & { coverImage: string }>
> => {
  try {
    const id = validateUUIDOrThrowError(formData.get("id"));

    await showcaseUseCase.publishShowcase(id);
    revalidatePath(routes.admin.website.showcases.main, "layout");
    return {
      status: "success",
      message: "Showcase published",
    };
  } catch (e) {
    return handleActionErrorWithValidation(e);
  }
};

export const unpublishShowcaseAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const id = validateUUIDOrThrowError(formData.get("id"));
    await showcaseUseCase.unpublishShowcase(id);
    revalidatePath(routes.admin.website.showcases.main, "layout");
    return {
      status: "success",
      message: "Showcase unpublished",
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const addShowcaseLinkAction = async (
  _: any,
  formData: FormData
): Promise<
  BaseActionResult | ValidationErrorActionResult<ShowcaseLinkCreateInput>
> => {
  try {
    const id = validateUUIDOrThrowError(formData.get("id"));
    const data = validateOrThrowValidationError(
      formData,
      ShowcaseLinkCreateInputSchema
    );
    await showcaseUseCase.addLink(id, data);
    revalidatePath(
      routes.admin.website.showcases["[id]"].edit.main({ id }),
      "layout"
    );
    return {
      status: "success",
      message: "Link added",
    };
  } catch (e) {
    return handleActionError(e);
  }
};
export const removeShowcaseLinkAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const id = validateUUIDOrThrowError(formData.get("id"));
    const linkId = validateUUIDOrThrowError(
      formData.get("linkId"),
      "Invalid Link ID"
    );
    await showcaseUseCase.removeLink(id, linkId);
    revalidatePath(
      routes.admin.website.showcases["[id]"].edit.main({ id }),
      "layout"
    );
    return {
      status: "success",
      message: "Link removed",
    };
  } catch (e) {
    return handleActionError(e);
  }
};
export const deleteShowcaseAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const id = validateUUIDOrThrowError(formData.get("id"));
    await showcaseUseCase.deleteShowcase(id);
    revalidatePath(routes.admin.website.showcases.main, "layout");
    redirect(routes.admin.website.showcases.main);
  } catch (e) {
    return handleActionError(e);
  }
};
