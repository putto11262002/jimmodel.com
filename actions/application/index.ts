"use server";
import {
  CompletedApplication,
  ApplicationExperienceCreateInput,
  ApplicationImageCreateInput,
  ApplicationImageCreateInputSchema,
  ApplicationSubmissionInput,
  ApplicationSubmissionInputSchema,
  OptionalApplicationCreateInputSchema,
  ApplicationExperienceCreateInputSchema,
  CompletedApplicationSchema,
  ApplicationGeneralSchema,
  ApplicationContactSchema,
  ApplicationAddressSchema,
  ApplicationMeasurementSchema,
  ApplicationTalentSchema,
} from "@/lib/usecases";
import {
  BaseActionResult,
  ValidationErrorActionResult,
  handleActionError,
  handleActionErrorWithValidation,
} from "../common";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getApplicationTokenOrRedirect } from "./utils";
import { applicationUseCase } from "@/config";
import {
  validateOrThrowValidationError,
  validateUUIDOrThrowError,
} from "../common/utils";
import routes from "@/config/routes";
import { z } from "zod";

export const createApplicationAction = async (
  _: any,
  __: FormData
): Promise<BaseActionResult> => {
  try {
    const { token, expiredAt } = await applicationUseCase.createApplication();
    const cookie = await cookies();
    cookie.set("applicationToken", token, {
      expires: expiredAt,
      sameSite: true,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    revalidatePath(routes.application.form.main, "layout");
    redirect(routes.application.form.main);
  } catch (e) {
    return handleActionError(e);
  }
};

export const updateApplicationAction = async (
  _: any,
  formData: FormData
): Promise<
  BaseActionResult | ValidationErrorActionResult<CompletedApplication>
> => {
  try {
    const form =
      typeof formData.get("form") === "string"
        ? (formData.get("form") as string)
        : "";
    let schema;
    switch (form) {
      case "general":
        schema = ApplicationGeneralSchema;
        break;
      case "contact":
        schema = ApplicationContactSchema;
        break;
      case "address":
        schema = ApplicationAddressSchema;
        break;
      case "talent":
        schema = ApplicationTalentSchema;
        break;
      case "measurement":
        schema = ApplicationMeasurementSchema;
        break;
      default:
        schema = CompletedApplicationSchema;
    }

    const applicationToken = await getApplicationTokenOrRedirect();

    const data = validateOrThrowValidationError(
      formData,
      schema as typeof CompletedApplicationSchema
    );

    await applicationUseCase.updateApplication(applicationToken, data);
    revalidatePath(routes.application.form.main, "layout");

    return { status: "success", message: "Application updated" };
  } catch (e) {
    return handleActionError(e);
  }
};

export const addApplicationExperienceAction = async (
  _: any,
  formData: FormData
): Promise<
  | BaseActionResult
  | ValidationErrorActionResult<ApplicationExperienceCreateInput>
> => {
  try {
    const applicationToken = await getApplicationTokenOrRedirect();
    const data = validateOrThrowValidationError(
      formData,
      ApplicationExperienceCreateInputSchema
    );
    await applicationUseCase.addExperience(applicationToken, data);
    revalidatePath(routes.application.form.experience, "layout");
    return { status: "success", message: "Experience added" };
  } catch (e) {
    return handleActionError(e);
  }
};

export const addApplicationImageAction = async (
  _: any,
  formData: FormData
): Promise<
  BaseActionResult | ValidationErrorActionResult<ApplicationImageCreateInput>
> => {
  try {
    const applicationToken = await getApplicationTokenOrRedirect();

    const data = validateOrThrowValidationError(
      formData,
      ApplicationImageCreateInputSchema
    );
    await applicationUseCase.addImage(applicationToken, data);
    revalidatePath("/application/images");
    return { status: "success", message: "Image added" };
  } catch (e) {
    return handleActionError(e);
  }
};

export const submitApplicationAction = async (
  _: any,
  formData: FormData
): Promise<
  BaseActionResult | ValidationErrorActionResult<ApplicationSubmissionInput>
> => {
  try {
    const applicationToken = await getApplicationTokenOrRedirect();
    const data = validateOrThrowValidationError(
      formData,
      ApplicationSubmissionInputSchema
    );
    await applicationUseCase.submitApplication(applicationToken, data);
    const cookiesStore = await cookies();
    cookiesStore.delete("applicationToken");
    revalidatePath(routes.application.form.main, "layout");
    redirect(routes.application.success);
  } catch (e) {
    revalidatePath(routes.application.form.submit);
    return handleActionErrorWithValidation(e);
  }
};

export const approveApplicationAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const id = validateUUIDOrThrowError(formData.get("id"));
    await applicationUseCase.approveApplication(id);
    revalidatePath(routes.admin.applications.main, "layout");
    return { status: "success", message: "Application approved" };
  } catch (e) {
    return handleActionError(e);
  }
};

export const rejectApplicationAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const id = validateUUIDOrThrowError(formData.get("id"));
    await applicationUseCase.rejectApplication(id);
    revalidatePath(routes.admin.applications.main, "layout");
    return { status: "success", message: "Application rejected" };
  } catch (e) {
    return handleActionError(e);
  }
};

export const deleteApplicationAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const id = validateUUIDOrThrowError(formData.get("id"));
    await applicationUseCase.deleteApplication(id);
    revalidatePath(routes.admin.applications.main, "layout");
    return { status: "success", message: "Application deleted" };
  } catch (e) {
    return handleActionError(e);
  }
};
