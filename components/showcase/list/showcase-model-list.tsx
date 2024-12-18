"use client";
import { deleteShowcaseModelAction } from "@/actions/showcase";
import ModelList from "@/components/model/lists/model-list";
import AsyncButton from "@/components/shared/buttons/async-button";
import { Button } from "@/components/ui/button";
import useActionState from "@/hooks/use-action-state";
import { Showcase } from "@/lib/domains";
import { X } from "lucide-react";

export default function ShowcaseModelList({
  showcase,
}: {
  showcase: Showcase;
}) {
  return (
    <ModelList
      models={showcase.showcaseModels.map((model) => ({
        name: model.modelName,
        profileImageId: model.modelProfileImage,
        id: model.modelId,
      }))}
      action={({ modelId }) => (
        <DeleteButton showcaseId={showcase.id} modelId={modelId} />
      )}
    />
  );
}

function DeleteButton({
  showcaseId,
  modelId,
}: {
  showcaseId: string;
  modelId: string | null;
}) {
  const { pending, dispatch } = useActionState(deleteShowcaseModelAction, {
    status: "idle",
  });
  return (
    <form action={dispatch}>
      <input type="hidden" name="id" value={showcaseId} />
      {modelId && <input type="hidden" name="modelId" value={modelId} />}
      {modelId ? (
        <AsyncButton pending={pending} variant={"ghost"} size={"icon"}>
          <X className="icon-sm" />
        </AsyncButton>
      ) : (
        <Button variant={"ghost"} size={"icon"} disabled>
          <X className="icon-sm" />
        </Button>
      )}
    </form>
  );
}
