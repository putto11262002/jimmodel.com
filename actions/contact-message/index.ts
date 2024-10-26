"use server";
import {
  ContactMessageCreateInput,
  ContactMessageCreateInputSchema,
} from "@/lib/usecases";
import {
  BaseActionResult,
  ValidationErrorActionResult,
  handleActionError,
  validateOrThrowValidationError,
  validateUUIDOrThrowError,
} from "../common";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import routes from "@/config/routes";
import { contactMessageUseCase } from "@/config";

export const createContactMessageAction = async (
  _: any,
  formData: FormData
): Promise<
  BaseActionResult | ValidationErrorActionResult<ContactMessageCreateInput>
> => {
  try {
    const data = validateOrThrowValidationError(
      formData,
      ContactMessageCreateInputSchema
    );
    await contactMessageUseCase.createContactMessage(data);
    redirect("/contact/success");
  } catch (e) {
    return handleActionError(e);
  }
};

export const markContactMessageAsReadAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const id = validateUUIDOrThrowError(formData.get("id"));
    await contactMessageUseCase.markContactMessagesAsRead(id);
    revalidatePath(routes.admin.contactMessages.main, "layout");
    return { status: "success", message: "Contact message marked as read" };
  } catch (e) {
    return handleActionError(e);
  }
};

export const deleteContactMessageAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  try {
    const id = validateUUIDOrThrowError(formData.get("id"));
    await contactMessageUseCase.deleteContactMessage(id);
    revalidatePath(routes.admin.contactMessages.main, "layout");
    return { status: "success", message: "Contact message deleted" };
  } catch (e) {
    return handleActionError(e);
  }
};
