import permissions from "@/config/permission";
import { Card } from "@/components/card";
import { getModelOrThrow } from "@/loaders/model";
import { auth } from "@/config";
import { Button } from "@/components/ui/button";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await auth({ permission: permissions.models.getModelById });
  const model = await getModelOrThrow(id);
  return (
    <Card title="Download" headerBorder description="Download model data">
      <div className="grid gap-2">
        <p className="text-sm text-muted-foreground">Download Model Summary</p>
        <a
          href={`/api/models/${model.id}/summary-sheet`}
          target="_blank"
          rel="noreferrer"
          download
        >
          <Button type="button" variant="secondary" size="sm">
            Download
          </Button>
        </a>
      </div>
    </Card>
  );
}
