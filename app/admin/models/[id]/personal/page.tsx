import { Card } from "@/components/card";
import ModelGeneralForm from "@/components/model/forms/model-general-form";
import { auth } from "@/config";
import permissions from "@/config/permission";
import { getModelOrThrow } from "@/loaders/model";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await auth({ permission: permissions.models.getModelById });
  const model = await getModelOrThrow(id);
  return (
    <Card title="General" headerBorder>
      <ModelGeneralForm model={model} />
    </Card>
  );
}
