import { Card } from "@/components/card";
import ModelProfileImageUploadForm from "@/components/model/forms/model-profile-image-upload-form";
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
    <Card>
      <ModelProfileImageUploadForm model={model} />
    </Card>
  );
}
