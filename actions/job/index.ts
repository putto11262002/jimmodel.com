"use server";

import {
  BookingCreateInput,
  BookingCreateInputSchema,
  JobCreateInput,
  JobCreateInputSchema,
  JobUpdateInput,
  JobUpdateInputSchema,
} from "@/lib/usecases";
import {
  ActionResultWithDataOnSuccess,
  BaseActionResult,
  ValidationErrorActionResult,
  handleActionError,
  validateOrThrowValidationError,
  validateUUIDOrThrowError,
} from "../common";
import permissions from "@/config/permission";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, jobUseCase } from "@/config";
import routes from "@/config/routes";
import { AppError } from "@/lib/errors";

export const createJobAction = async (
  _: any,
  formData: FormData
): Promise<
  | ActionResultWithDataOnSuccess<string>
  | ValidationErrorActionResult<JobCreateInput>
> => {
  try {
    const session = await auth({ permission: permissions.jobs.createJob });
    const data = validateOrThrowValidationError(formData, JobCreateInputSchema);

    const createdJobId = await jobUseCase.createJob(data, session.user.id);

    revalidatePath(routes.admin.jobs.main);
    return {
      status: "success",
      message: "Update created",
      data: createdJobId,
    };
  } catch (err) {
    return handleActionError(err);
  }
};

export const updateJobAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult | ValidationErrorActionResult<JobUpdateInput>> => {
  try {
    await auth({ permission: permissions.jobs.updateJobById });
    const id = validateUUIDOrThrowError(formData.get("id"));

    const data = validateOrThrowValidationError(formData, JobUpdateInputSchema);

    await jobUseCase.updateJob(id, data);
    revalidatePath(routes.admin.jobs["[id]"].edit.main({ id }), "layout");

    return {
      status: "success",
      message: "Job updated",
    };
  } catch (err) {
    return handleActionError(err);
  }
};

export const deleteJobAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const session = await auth({ permission: permissions.jobs.deleteJob });
    const id = validateUUIDOrThrowError(formData.get("id"));
    await jobUseCase.deleteJob(id, session.user.id);
    revalidatePath(routes.admin.jobs.main, "layout");
    redirect(routes.admin.jobs.main);
  } catch (e) {
    return handleActionError(e);
  }
};

export const addJobModelAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const session = await auth({ permission: permissions.jobs.addModels });
    const id = validateUUIDOrThrowError(formData.get("id"));
    const modelId = validateUUIDOrThrowError(
      formData.get("modelId"),
      "Invalid model id"
    );
    await jobUseCase.addModel(id, modelId, session.user.id);
    revalidatePath(routes.admin.jobs["[id]"].models({ id }), "layout");
    return {
      status: "success",
      message: "Model added to job",
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const removeJobModelAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const session = await auth({ permission: permissions.jobs.removeModel });
    const id = validateUUIDOrThrowError(formData.get("id"));
    const modelId = validateUUIDOrThrowError(
      formData.get("modelId"),
      "Invalid model id"
    );

    revalidatePath(routes.admin.jobs["[id]"].models({ id }), "layout");
    await jobUseCase.removeModel(id, modelId, session.user.id);
    return {
      status: "success",
      message: "Model removed from job",
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const confirmJobAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const session = await auth({ permission: permissions.jobs.confirmJob });
    const id = validateUUIDOrThrowError(formData.get("id"));
    await jobUseCase.confirmJob(id, session.user.id);
    revalidatePath(routes.admin.jobs.main, "layout");
    return {
      status: "success",
      message: "Job confirmed",
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const cancelJobAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const session = await auth({ permission: permissions.jobs.cancelJob });
    const jobId = validateUUIDOrThrowError(formData.get("id"));
    await jobUseCase.cancelJob(jobId, session.user.id);
    revalidatePath(routes.admin.jobs.main, "layout");
    return {
      status: "success",
      message: "Job cancelled",
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const archiveJobAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const session = await auth({ permission: permissions.jobs.archiveJob });
    const id = validateUUIDOrThrowError(formData.get("id"));
    await jobUseCase.archiveJob(id, session.user.id);
    revalidatePath(routes.admin.jobs.main, "layout");
    return {
      status: "success",
      message: "Job archived",
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const createBookingAction = async (
  _: any,
  formData: FormData
): Promise<
  BaseActionResult | ValidationErrorActionResult<BookingCreateInput>
> => {
  try {
    const session = await auth({ permission: permissions.jobs.addBooking });
    const id = validateUUIDOrThrowError(formData.get("id"));
    const data = validateOrThrowValidationError(
      formData,
      BookingCreateInputSchema
    );
    await jobUseCase.addBooking(id, data, session.user.id);
    revalidatePath(routes.admin.jobs["[id]"].bookings({ id }), "layout");
    return {
      status: "success",
      message: "Booking created",
    };
  } catch (e) {
    return handleActionError(e);
  }
};

export const deleteBookingAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const session = await auth({ permission: permissions.jobs.addBooking });
    const id = validateUUIDOrThrowError(formData.get("id"));
    const bookingId = validateUUIDOrThrowError(formData.get("bookingId"));
    await jobUseCase.removeBooking(id, bookingId, session.user.id);
    revalidatePath(routes.admin.jobs["[id]"].bookings({ id }), "layout");
    return { status: "success", message: "Booking deleted" };
  } catch (e) {
    return handleActionError(e);
  }
};

export const updateJobPermission = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const session = await auth({
      permission: permissions.jobs.updateJobPermissions,
    });
    const _private =
      typeof formData.get("private") === "string"
        ? formData.get("private") === "true"
        : false;
    const id = validateUUIDOrThrowError(formData.get("id"));
    await jobUseCase.updateJobPermission(id, _private, session.user.id);
    revalidatePath(routes.admin.jobs["[id]"].main({ id }), "layout");
    return {
      status: "success",
      message: "Job permission updated",
    };
  } catch (e) {
    return handleActionError(e);
  }
};
