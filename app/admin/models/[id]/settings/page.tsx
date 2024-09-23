import permissions from "@/config/permission";
import { Card } from "@/components/card";
import { getModelOrThrow } from "@/loaders/model";
import ModelSettingsUpdateForm from "@/components/model/forms/model-settings-update-form";
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
    <Card title="Settings" headerBorder description="Model Settings">
      <ModelSettingsUpdateForm model={model} />
    </Card>
  );
}
