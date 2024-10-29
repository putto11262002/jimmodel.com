"use server";
import {
  UserCreateInput,
  UserCreateInputSchema,
  UserRolesInputSchema,
  UserRolesUpdateInput,
  uuidValidator,
} from "@/lib/usecases";
import {
  ActionResult,
  ActionResultWithDataOnSuccess,
  BaseActionResult,
  EmptyActionResult,
  IdelActionResult,
  ValidationErrorActionResult,
} from "../common/action-result";
import { FieldsValidationError } from "../common/validation-error";
import { ForbiddenError } from "@/lib/errors";
import permissions from "@/config/permission";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { UserImageInputSchema } from "@/lib/usecases/user/inputs/user-image-input/validator";
import { checkPermission } from "@/lib/auth";
import { handleActionError } from "../common/handle-action-error";
import { validateFormData } from "@/lib/utils/form-data";
import {
  UserPasswordResetInput,
  UserPasswordResetInputSchema,
} from "@/lib/usecases/user/inputs/password-input/validator";
import { auth, userUseCase } from "@/config";
import {
  validateOrThrowValidationError,
  validateUUIDOrThrowError,
} from "../common";
import routes from "@/config/routes";

export const createUserAction = async (
  _: any,
  formData: FormData
): Promise<
  | ActionResultWithDataOnSuccess<string>
  | ValidationErrorActionResult<UserCreateInput>
> => {
  try {
    await auth({ permission: permissions.users.createUser });
    const data = validateOrThrowValidationError(
      formData,
      UserCreateInputSchema
    );
    const createdUserId = await userUseCase.createUser(data);
    revalidatePath(routes.admin.users.main, "page");
    return {
      status: "success",
      data: createdUserId,
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const updateUserRolesAction = async (
  __: any,
  formData: FormData
): Promise<
  BaseActionResult | ValidationErrorActionResult<UserRolesUpdateInput>
> => {
  try {
    await auth({
      permission: permissions.users.updateRoleById,
    });

    const id = validateUUIDOrThrowError(formData.get("id"));

    const data = validateOrThrowValidationError(formData, UserRolesInputSchema);

    await userUseCase.updateUserRoles(id, data);

    revalidatePath(routes.admin.users.main, "page");
    revalidatePath(routes.admin.users.edit.roles(id), "page");
    return {
      status: "success",
      message: "User roles updated",
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const resetPasswordAction = async (
  _: any,
  formData: FormData
): Promise<
  BaseActionResult | ValidationErrorActionResult<UserPasswordResetInput>
> => {
  try {
    const session = await auth();

    const idValidation = uuidValidator.safeParse(formData.get("id"));
    if (!idValidation.success) {
      return {
        status: "error",
        message: "Invalid id",
      };
    }

    // If it is not admin, it can only update its own roles
    if (
      checkPermission(session.user, permissions.users.updatePasswordById) !==
        "success" &&
      idValidation.data !== session.user.id
    ) {
      throw new ForbiddenError("You are not allowed to update password");
    }

    const inputValidation = validateFormData(
      formData,
      UserPasswordResetInputSchema
    );
    if (!inputValidation.ok) {
      return {
        status: "validationError",
        message: "Invalid input",
        data: inputValidation.fieldErorrs,
      };
    }

    await userUseCase.resetPassword(
      idValidation.data,
      inputValidation.data.password,
      session.user.id
    );
    return {
      status: "success",
      message: "Password reset",
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const updateUserImageAction = async (
  _: any,
  formData: FormData
): Promise<
  | IdelActionResult
  | EmptyActionResult<"success">
  | EmptyActionResult<"error">
  | ActionResult<"validationError", FieldsValidationError<{ file: Blob }>>
> => {
  try {
    const session = await auth();

    const idValidation = uuidValidator.safeParse(formData.get("id"));
    if (!idValidation.success) {
      return {
        status: "error",
        message: "Invalid id",
      };
    }

    // If it is not admin, it can only update its own roles
    if (
      checkPermission(session.user, permissions.users.updateImage) !==
        "success" &&
      idValidation.data !== session.user.id
    ) {
      throw new ForbiddenError("You are not allowed to update profile image");
    }

    const inputValidation = UserImageInputSchema.safeParse(
      formData.get("file")
    );
    if (!inputValidation.success) {
      return {
        status: "validationError",
        data: { file: inputValidation.error.flatten()?.formErrors },
      };
    }
    await userUseCase.updateProfileImage(
      idValidation.data,
      inputValidation.data
    );

    revalidatePath(`/admin/users/${idValidation.data}/update/image`, "page");
    return {
      status: "success",
      message: "User profile updated",
    };
  } catch (e) {
    return handleActionError(e);
  }
};
