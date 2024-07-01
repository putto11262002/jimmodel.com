"use client";
import { useToast } from "@/components/ui/use-toast";
import { Model, ModelUpdateInput } from "@/db/schemas/models";
import { updateModelAction } from "@/lib/actions/model";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { forms } from "./config";

export default function ModelUpdateForms({
  modelId,
  formId,
  model,
}: {
  modelId: string;
  formId: string;
  model: Model;
}) {
  const Form = forms[formId];
  const router = useRouter();

  useEffect(() => {
    if (!Form) {
      router.push(`/admin/models/update/${modelId}/general`);
    }
  }, [Form]);

  const { toast } = useToast();
  const onSubmit = async (formData: ModelUpdateInput) => {
    try {
      await updateModelAction(modelId, formData);
      toast({ title: "Success", description: "Model updated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Model update failed" });
    }
  };

  if (!Form) {
    return null;
  }

  return (
    <>
      <Form onSubmit={onSubmit} initialData={model} />
    </>
  );
}
