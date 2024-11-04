import { addJobModelAction } from "@/actions/job";
import ModelSearchDialog from "@/components/model/model-search-dialog";
import useActionToast from "@/hooks/use-action-toast";
import { Job } from "@/lib/domains/types/job";
import { objToFormData } from "@/lib/utils/form-data";
import { useActionState } from "react";

export default function JobModelAddDialog({
  job,
  open,
  setOpen,
}: {
  job: Job;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [state, action] = useActionState(addJobModelAction, {
    status: "idle",
  });
  useActionToast({ state });
  return (
    <ModelSearchDialog
      onSelect={(modelId) => action(objToFormData({ modelId, id: job.id }))}
      ignore={job.jobModels.map((jm) => jm.modelId).filter((id) => id !== null)}
      open={open}
      setOpen={setOpen}
    />
  );
}
