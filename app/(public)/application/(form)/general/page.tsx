import ApplicationGeneralForm from "@/components/application/forms/general-form";
import { CompletedApplicationSchema } from "@/lib/usecases/application/inputs";
import { getApplicationByToken } from "@/loaders/application";

export default async function Page() {
  const application = await getApplicationByToken();
  const validation = CompletedApplicationSchema.safeParse(application);

  return (
    <ApplicationGeneralForm
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
