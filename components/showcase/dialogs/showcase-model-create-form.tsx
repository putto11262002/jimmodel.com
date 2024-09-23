"use client";
import { createShowcaseModelAction } from "@/actions/showcase";
import IconButton from "@/components/icon-button";
import ModelSearchDialog from "@/components/model/model-search-dialog";
import { Showcase } from "@/lib/domains";
import { objToFormData } from "@/lib/utils/form-data";
import { PlusCircle } from "lucide-react";
import { useActionState } from "react";

export default function ShowcaseModelCreateDialog({
  showcase,
}: {
  showcase: Showcase;
}) {
  const [state, action, pending] = useActionState(createShowcaseModelAction, {
    status: "idle",
  });
  return (
    <>
      <ModelSearchDialog
        onSelect={(modelId) =>
          action(objToFormData({ id: showcase.id, modelId }))
        }
        ignore={showcase.showcaseModels.map((m) => m.modelId)}
        trigger={
          <IconButton
            size="sm"
            icon={<PlusCircle className="icon-sm" />}
            text="Model"
          />
        }
      />
    </>
  );
}
