import { Card } from "@/components/card";
import ModelExperienceCreateForm from "@/components/model/forms/model-experience-create-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Card title="Add New Experience" headerBorder>
      <ModelExperienceCreateForm modelId={id} />
    </Card>
  );
}
