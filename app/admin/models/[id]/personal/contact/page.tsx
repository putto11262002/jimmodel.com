import permissions from "@/config/permission";
import { Card } from "@/components/card";
import ModelContactForm from "@/components/model/forms/model-contact-form";
import { getModelOrThrow } from "@/loaders/model";
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
      title="Contact Info"
      headerBorder
      description="Model Contact information"
    >
      <ModelContactForm model={model} />
    </Card>
  );
}
