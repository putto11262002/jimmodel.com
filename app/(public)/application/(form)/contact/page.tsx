import ApplicationContactForm from "@/components/application/forms/application-contact-form";
import { Card } from "@/components/card";
import { CompletedApplicationSchema } from "@/lib/usecases/application/inputs";
import { getApplicationByToken } from "@/loaders/application";

export default async function Page() {
  const application = await getApplicationByToken();
  const validation = CompletedApplicationSchema.safeParse(application);

  return (
    <ApplicationContactForm
      application={application}
      initialState={
        validation.success
          ? undefined
          : {
              status: "validationError",
              data: validation.error.flatten().fieldErrors,
            }
      }
    />
  );
}
