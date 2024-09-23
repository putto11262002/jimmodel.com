import permissions from "@/config/permission";
import { Card } from "@/components/card";
import { getModelOrThrow } from "@/loaders/model";
import ModelAddressForm from "@/components/model/forms/model-address-form";
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
    <Card title="Address" headerBorder description="Model Address information">
      <ModelAddressForm model={model} />
    </Card>
  );
}
