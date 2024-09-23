import permissions from "@/config/permission";
import { Card } from "@/components/card";
import { getModelOrThrow } from "@/loaders/model";
import ModelModelingForm from "@/components/model/forms/model-modeling-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const model = await getModelOrThrow(id);
  return (
    <Card
      title="Modeling Info"
      headerBorder
      description="Modeling related information"
    >
      <ModelModelingForm model={model} />
    </Card>
  );
}
