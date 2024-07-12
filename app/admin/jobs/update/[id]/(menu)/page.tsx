import JobForm from "./_components/job-form";
import MetadataCard from "./_components/_components/metadata-card";
import ActionCard from "./_components/_components/action-card";
import ModelForm from "./_components/model-form";
import { Suspense } from "react";
import { Loader } from "lucide-react";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <div className=" grid grid-cols-3 gap-4">
      <div className="col-span-2 grid gap-4">
        <JobForm jobId={id} />
      </div>
      <div className="flex flex-col gap-4">
        <MetadataCard jobId={id} />
        <ActionCard jobId={id} />
        <ModelForm jobId={id} />
      </div>
    </div>
  );
}
