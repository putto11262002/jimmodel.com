import permissions from "@/config/permission";
import { Card } from "@/components/card";
import { getModelOrThrow } from "@/loaders/model";
import ModelIdenticationForm from "@/components/model/forms/model-identication-form";
import { auth } from "@/config";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await auth({ permission: permissions.models.getModelById });
  const model = await getModelOrThrow(id);
  return (
    <Card
      title="Identification & Documents"
      headerBorder
      description="Model Identification & Documents information"
    >
      <ModelIdenticationForm model={model} />
    </Card>
  );
}
