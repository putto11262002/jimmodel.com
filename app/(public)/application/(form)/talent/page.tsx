import ApplicationTalentForm from "@/components/application/forms/application-talent-form";
import { CompletedApplicationSchema } from "@/lib/usecases/application/inputs";
import { getApplicationByToken } from "@/loaders/application";

export default async function Page() {
  const application = await getApplicationByToken();
  const validation = CompletedApplicationSchema.safeParse(application);

  return (
    <ApplicationTalentForm
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
