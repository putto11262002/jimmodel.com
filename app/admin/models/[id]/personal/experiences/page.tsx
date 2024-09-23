import { Card } from "@/components/card";
import IconButton from "@/components/icon-button";
import ModelExperienceCreateDialog from "@/components/model/dialogs/model-experience-create-dialog";
import ModelExperienceTable from "@/components/model/tables/model-experience-table";
import { auth } from "@/config";
import permissions from "@/config/permission";
import { getModelExperiences } from "@/loaders/model";
import { PlusCircle } from "lucide-react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await auth({ permission: permissions.models.getModelExperiences });
  const experiences = await getModelExperiences(id);
  return (
    <Card
      headerBorder
      title="Model Experiences"
      action={
        <ModelExperienceCreateDialog
          modelId={id}
          trigger={
            <IconButton
              size="sm"
              icon={<PlusCircle className="w-3.5 h-3.5" />}
              text="Experience"
            />
          }
        />
      }
    >
      <ModelExperienceTable experiences={experiences} />
    </Card>
  );
}
