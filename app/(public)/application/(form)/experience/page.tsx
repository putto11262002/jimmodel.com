import ApplicationExperienceCreateDialog from "@/components/application/dialogs/application-experience-create-dialog";
import ApplicationExperienceTable from "@/components/application/tables/application-experience-table";
import IconButton from "@/components/icon-button";
import { getApplicationExerperiencesByToken } from "@/loaders/application";
import { PlusCircle } from "lucide-react";

export default async function Page() {
  const experiences = await getApplicationExerperiencesByToken();
  return (
    <div className="grid gap-4">
      <div>
        <ApplicationExperienceCreateDialog
          trigger={
            <IconButton
              size="sm"
              icon={<PlusCircle className="icon-sm" />}
              text="Experience"
            />
          }
        />
      </div>

      <ApplicationExperienceTable experiences={experiences} />
    </div>
  );
}
