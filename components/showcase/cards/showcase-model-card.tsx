import { Card } from "@/components/card";
import ShowcaseModelList from "@/components/showcase/list/showcase-model-list";
import Alert from "@/components/alert";
import { Showcase } from "@/lib/domains";
import { PublishValidationError } from "@/lib/usecases";
import ShowcaseModelCreateDialog from "../dialogs/showcase-model-create-form";

export default async function ShowcaseModelCard({
  showcase,
  publishValidation,
}: {
  showcase: Showcase;
  publishValidation?: PublishValidationError;
}) {
  return (
    <Card action={<ShowcaseModelCreateDialog showcase={showcase} />}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          {publishValidation?.models?.map((err, index) => (
            <Alert key={index} variant="warning">
              {err}
            </Alert>
          ))}
        </div>
        <ShowcaseModelList showcase={showcase} />
      </div>
    </Card>
  );
}
