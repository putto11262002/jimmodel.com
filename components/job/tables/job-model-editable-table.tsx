"use client";
import { removeJobModelAction } from "@/actions/job";
import ModelList from "@/components/model/lists/model-list";
import AsyncButton from "@/components/shared/buttons/async-button";
import useActionState from "@/hooks/use-action-state";
import { JobModel } from "@/lib/domains/types";
import { objToFormData } from "@/lib/utils/form-data";
import { X } from "lucide-react";

export default function JobModelEditableTable({
  models,
  jobId,
}: {
  models: JobModel[];
  jobId: string;
}) {
  return (
    <ModelList
      models={models.map((model) => ({
        id: model.modelId,
        name: model.modelName,
        profileImageId: model.modelImageId,
      }))}
      action={({ modelId }) => <DeleteButton modelId={modelId} jobId={jobId} />}
    />
  );
}

function DeleteButton({ modelId, jobId }: { modelId: string; jobId: string }) {
  const { dispatch, pending } = useActionState(removeJobModelAction, {
    status: "idle",
  });

  return (
    <form action={dispatch}>
      <input type="hidden" name="id" value={jobId} />
      <input type="hidden" name="modelId" value={modelId} />
      <AsyncButton pending={pending} variant={"ghost"} size={"icon"}>
        <X className="icon-sm" />
      </AsyncButton>
    </form>
  );
}
