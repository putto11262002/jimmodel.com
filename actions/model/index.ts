"use server";
import {
  ModelBlockCreateInput,
  ModelBlockCreateInputSchema,
  ModelCreateInput,
  ModelCreateInputSchema,
  ModelExperienceCreateInput,
  ModelExperienceCreateInputSchema,
  ModelImageUpdateTypeInputSchema,
  ModelSettingUpdateInput,
  ModelSettingUpdateInputSchema,
  ModelUpdateInput,
  ModelUpdateInputSchema,
  NewModelImageCreateInput,
  NewModelImageCreateInputSchema,
  NewModelProfileImageInput,
  NewModelProfileImageInputSchema,
} from "@/lib/usecases";
import {
  ActionResult,
  ActionResultWithDataOnSuccess,
  BaseActionResult,
  EmptyActionResult,
  ValidationErrorActionResult,
  FieldsValidationError,
  handleActionError,
} from "../common";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth, modelUseCase } from "@/config";
import {
  validateOrThrowValidationError,
  validateUUIDOrThrowError,
} from "../common";
import routes from "@/config/routes";
import permissions from "@/config/permission";

export const createModelAction = async (
  _: any,
  formData: FormData
): Promise<
  | ActionResultWithDataOnSuccess<string>
  | ValidationErrorActionResult<ModelCreateInput>
> => {
  try {
    await auth({ permission: permissions.models.createModel });
    const data = validateOrThrowValidationError(
      formData,
      ModelCreateInputSchema,
      { emptyString: "undefined" }
    );
    var createdModelId = await modelUseCase.createModel(data);
    revalidatePath(routes.admin.models.main);
    return {
      status: "success",
      data: createdModelId,
      message: "Model created",
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const updateModelAction = async (
  _: any,
  formData: FormData
): Promise<
  | EmptyActionResult<"idle">
  | EmptyActionResult<"success">
  | EmptyActionResult<"error">
  | ActionResult<"validationError", FieldsValidationError<ModelUpdateInput>>
> => {
  try {
    await auth({ permission: permissions.models.updateModelById });
    const id = validateUUIDOrThrowError(formData.get("id"));
    const data = validateOrThrowValidationError(
      formData,
      ModelUpdateInputSchema
    );

    await modelUseCase.updateModel(id, data);

    revalidatePath(routes.admin.models.edit.main(id), "layout");
    return {
      status: "success",
      message: "Model updated",
    };
  } catch (e) {
    return handleActionError(e);
  }
};
export const addModelExperienceAction = async (
  _: any,
  formData: FormData
): Promise<
  BaseActionResult | ValidationErrorActionResult<ModelExperienceCreateInput>
> => {
  try {
    await auth({ permission: permissions.models.addModelExperience });
    const id = validateUUIDOrThrowError(formData.get("id"));
    const data = validateOrThrowValidationError(
      formData,
      ModelExperienceCreateInputSchema
    );

    await modelUseCase.addExperience(id, data);

    revalidatePath(routes.admin.models.edit.experiences(id), "layout");
    redirect(routes.admin.models.edit.experiences(id));
  } catch (e) {
    return handleActionError(e);
  }
};

export const removeModelExperienceAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    await auth({ permission: permissions.models.removeModelExperience });
    const id = validateUUIDOrThrowError(formData.get("id"));
    await modelUseCase.removeExperience(id);

    revalidatePath(routes.admin.models.edit.experiences(id), "page");
    return {
      status: "success",
      message: "Experience deleted",
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const updateModelProfileImageAction = async (
  _: any,
  formData: FormData
): Promise<
  BaseActionResult | ValidationErrorActionResult<NewModelProfileImageInput>
> => {
  try {
    await auth({ permission: permissions.models.updateModelById });
    const id = validateUUIDOrThrowError(formData.get("id"));

    const data = validateOrThrowValidationError(
      formData,
      NewModelProfileImageInputSchema
    );
    await modelUseCase.updateProfileImage(id, data);

    revalidatePath(routes.admin.models.edit.profileImage(id), "page");
    return {
      status: "success",
      message: "Profile image updated",
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const uploadModelImageAction = async (
  _: any,
  formData: FormData
): Promise<
  BaseActionResult | ValidationErrorActionResult<NewModelImageCreateInput>
> => {
  try {
    await auth({ permission: permissions.models.addModelImage });
    const id = validateUUIDOrThrowError(formData.get("id"));
    const data = validateOrThrowValidationError(
      formData,
      NewModelImageCreateInputSchema
    );
    await modelUseCase.addModelImage(id, data);
    revalidatePath(routes.admin.models.edit.images(id), "page");
    return {
      status: "success",
      message: "Image uploaded",
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const removeModelImageAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    await auth({ permission: permissions.models.removeModelImageById });
    const id = validateUUIDOrThrowError(formData.get("id"));
    const fileId = validateUUIDOrThrowError(
      formData.get("fileId"),
      "Invalid file ID"
    );
    await modelUseCase.removeImage(id, fileId);
    revalidatePath(routes.admin.models.edit.images(id), "page");
    return {
      status: "success",
      message: "Image deleted",
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const updateModelImageTypeAction = async (
  _: any,
  formData: FormData
): Promise<
  BaseActionResult | ValidationErrorActionResult<{ type: string }>
> => {
  try {
    await auth({ permission: permissions.models.addModelImage });
    const id = validateUUIDOrThrowError(formData.get("id"));
    const fileId = validateUUIDOrThrowError(
      formData.get("fileId"),
      "Invalid file ID"
    );
    const data = validateOrThrowValidationError(
      formData,
      ModelImageUpdateTypeInputSchema
    );

    await modelUseCase.updateModelImageType(id, fileId, data);
    revalidatePath(routes.admin.models.edit.images(id), "page");
    return {
      status: "success",
      message: "Image type updated",
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const updateModelSettingAction = async (
  _: any,
  formData: FormData
): Promise<
  BaseActionResult | ValidationErrorActionResult<ModelSettingUpdateInput>
> => {
  try {
    await auth({ permission: permissions.models.updateModelSettings });
    const id = validateUUIDOrThrowError(formData.get("id"));
    const data = validateOrThrowValidationError(
      formData,
      ModelSettingUpdateInputSchema
    );

    await modelUseCase.updateModelSettings(id, data);
    revalidatePath(routes.admin.models.main, "layout");
    return {
      status: "success",
      message: "Settings updated",
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const createModelBlockAction = async (
  _: any,
  formData: FormData
): Promise<
  BaseActionResult | ValidationErrorActionResult<ModelBlockCreateInput>
> => {
  try {
    await auth({ permission: permissions.models.addModelBlock });
    const modelId = validateUUIDOrThrowError(
      formData.get("modelId"),
      "Invalid model id"
    );
    const data = validateOrThrowValidationError(
      formData,
      ModelBlockCreateInputSchema
    );
    await modelUseCase.createBlock(modelId, data);
    revalidatePath(routes.admin.models.edit.blocks(modelId), "layout");
    revalidatePath(routes.admin.calendar, "layout");
    return {
      status: "success",
      message: "Block created",
    };
  } catch (e) {
    return handleActionError(e);
  }
};
export const deleteModelBlockAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    await auth({ permission: permissions.models.removeModelBlockById });
    const blockId = validateUUIDOrThrowError(
      formData.get("blockId"),
      "Invalid block id"
    );

    const modelId = validateUUIDOrThrowError(
      formData.get("modelId"),
      "Invalid model id"
    );
    await modelUseCase.deleteBlock(blockId);
    revalidatePath(routes.admin.calendar, "layout");
    revalidatePath(routes.admin.models.edit.blocks(modelId), "layout");
    return {
      status: "success",
      message: "Block deleted",
    };
  } catch (e) {
    return handleActionError(e);
  }
};
