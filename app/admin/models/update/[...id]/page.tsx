import { cache } from "react";
import { findModelById } from "@/lib/usecases/model";
import { redirect } from "next/navigation";
import ModelUpdateForms from "./forms";
import { forms } from "./forms/config";

const getModelWithCache = cache(findModelById);

export default async function Page({
  params: { id },
}: {
  params: { id: string[] };
}) {
  const [modelId, formId] = id as [string, string];

  const model = await getModelWithCache(modelId);

  if (model === null) {
    throw Error("Model not found");
  }

  return <ModelUpdateForms model={model} modelId={modelId} formId={formId} />;
}
