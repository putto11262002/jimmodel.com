import permissions from "@/config/permission";
import { Card } from "@/components/card";
import { getModelOrThrow } from "@/loaders/model";
import { auth } from "@/config";
import LabelValueItem from "@/components/key-value/key-value-item";
import { formatDate } from "@/lib/utils/date";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await auth({ permission: permissions.models.getModelById });
  const model = await getModelOrThrow(id);
  return (
    <Card title="Metadata" headerBorder>
      <div className="grid gap-4">
        <LabelValueItem
          size="sm"
          line="break"
          label="Created At"
          value={formatDate(model.createdAt)}
        />
        <LabelValueItem
          size="sm"
          line="break"
          label="Updated At"
          value={formatDate(model.updatedAt)}
        />
        <LabelValueItem
          size="sm"
          line="break"
          label="Model ID"
          value={model.id}
        />
      </div>
    </Card>
  );
}
