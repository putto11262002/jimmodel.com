"use client";
import { addJobModelAction } from "@/actions/job";
import IconButton from "@/components/icon-button";
import ModelSearchDialog from "@/components/model/model-search-dialog";
import useActionToast from "@/hooks/use-action-toast";
import { Job } from "@/lib/domains/types/job";
import { objToFormData } from "@/lib/utils/form-data";
import { PlusCircle } from "lucide-react";
import { useActionState } from "react";

export default function JobModelAddDialog({ job }: { job: Job }) {
  const [state, action] = useActionState(addJobModelAction, {
    status: "idle",
  });
  useActionToast({ state });
  return (
    <ModelSearchDialog
      onSelect={(modelId) => action(objToFormData({ modelId, id: job.id }))}
      ignore={job.jobModels.map((jm) => jm.modelId).filter((id) => id !== null)}
      trigger={
        <IconButton
          size={"xs"}
          icon={<PlusCircle className="w-3.5 h-3.5" />}
          text="Model"
        />
      }
    />
  );
}
