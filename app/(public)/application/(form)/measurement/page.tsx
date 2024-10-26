import ApplicationMeasurementForm from "@/components/application/forms/application-measurement-form";
import { CompletedApplicationSchema } from "@/lib/usecases/application/inputs";
import { getApplicationByToken } from "@/loaders/application";

export default async function Page() {
  const application = await getApplicationByToken();
  const validation = CompletedApplicationSchema.safeParse(application);

  return (
    <div className="grid gap-4">
      <ApplicationMeasurementForm
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
    </div>
  );
}
