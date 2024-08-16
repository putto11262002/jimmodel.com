"use client";
import AddNewExperienceDialog from "@/components/application/add-application-dialog";
import Loader from "@/components/loader";
import ExperienceTable from "@/components/model/experience-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import permissions from "@/config/permission";
import {
  useAddModelExperience,
  useGetModelExperiences,
  useRemoveModelExperience,
} from "@/hooks/queries/model";
import useSession from "@/hooks/use-session";
import { Plus } from "lucide-react";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const session = useSession(permissions.models.getModelExperiencesById);
  const { data, isLoading } = useGetModelExperiences({
    modelId: id,
    enabled: session.status === "authenticated",
  });
  const { mutate: addExperience } = useAddModelExperience();
  const { mutate: removeExperience } = useRemoveModelExperience();

  if (isLoading || !data) {
    return <Loader />;
  }

  return (
    <Card>
      <CardHeader className="">
        <div className="flex flex-row items-center justify-between">
          <CardTitle>Experience</CardTitle>
          <AddNewExperienceDialog
            onSubmit={(input) => addExperience({ modelId: id, input })}
          >
            <Button className="h-7 w-7" variant={"outline"} size={"icon"}>
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </AddNewExperienceDialog>
        </div>
      </CardHeader>
      <CardContent>
        <ExperienceTable
          onRemove={({ id: experienceId }) =>
            removeExperience({ modelId: id, experienceId })
          }
          experiences={data}
        />
      </CardContent>
    </Card>
  );
}
