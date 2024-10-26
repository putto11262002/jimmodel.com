import Alert from "@/components/alert";
import ApplicationSubmissionForm from "@/components/application/forms/application-submission-form";
import { camelCaseToText } from "@/lib/utils/text";
import { safeValidationApplicationAction } from "@/loaders/application";

export default async function Page() {
  const result = await safeValidationApplicationAction();

  return (
    <div>
      <div className="min-h-28 flex flex-col gap-4 items-start justify-center ">
        {!result.ok ? (
          <Alert className="w-full" variant="error">
            <h2 className="pb-2">
              Oops! There are some errors in your application:
            </h2>
            <ul className="list-disc list-inside grid gap-1">
              {!result.ok &&
                Object.entries(result.errors).map(([key, value], index) => (
                  <li key={index}>
                    <span className="font-medium">{camelCaseToText(key)}</span>
                    {" - "}
                    <span>{value?.[0]}</span>
                  </li>
                ))}
            </ul>
          </Alert>
        ) : (
          <Alert className="w-full" variant="success">
            Your application looks good! Ready to submit?
          </Alert>
        )}
        <div className="w-full">
          <ApplicationSubmissionForm disabled={!result.ok} />
        </div>
      </div>
    </div>
  );
}
