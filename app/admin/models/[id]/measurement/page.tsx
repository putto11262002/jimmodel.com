import permissions from "@/config/permission";
import { Card } from "@/components/card";
import { getModelOrThrow } from "@/loaders/model";
import { auth } from "@/config";
import ModelBasicMeasurementForm from "@/components/model/forms/model-basic-measurement-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await auth({ permission: permissions.models.getModelById });
  const model = await getModelOrThrow(id);
  return (
    <Card title="Basic" headerBorder>
      <ModelBasicMeasurementForm model={model} />
    </Card>
  );
}
