import Avatar from "@/components/avatar";
import { Card } from "@/components/card";
import ModelProfileImageUploadForm from "@/components/model/forms/model-profile-image-upload-form";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { auth } from "@/config";
import permissions from "@/config/permission";
import routes from "@/config/routes";
import { getModelOrThrow } from "@/loaders/model";
import Image from "next/image";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await auth({ permission: permissions.models.getModelById });
  const model = await getModelOrThrow(id);
  return (
    <div className="grid gap-4">
      <h2 className="font-semibold">Profile Image</h2>
      <Card>
        <div className="grid gap-4">
          <Avatar size="xl" name={model.name} fileId={model.profileImageId} />
          <ModelProfileImageUploadForm model={model} />
        </div>
      </Card>
    </div>
  );
}
