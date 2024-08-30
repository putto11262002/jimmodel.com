"use server";
import { contactMessageUseCase } from "@/lib/usecases";
import { ContactMessageCreateInputSchema } from "@/lib/validators/contact-message";
import { redirect } from "next/navigation";

export const submitContactFormAction = async (_: any, formData: FormData) => {
  const validationResult = ContactMessageCreateInputSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });
  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
      id: null,
    };
  }
  const { id } = await contactMessageUseCase.createContactMessaage(
    validationResult.data,
  );

  redirect("/contact/success");
};
