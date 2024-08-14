"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAddModel, useGetJob } from "@/hooks/queries/job";
import SearchModelDialog from "@/components/model/search-model-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import ModelTable from "./model-table";
import { Job } from "@/lib/types/job";

export default function ModelForm({ job }: { job: Job }) {
  const { data, isPending, isSuccess } = useGetJob({ jobId: job.id });

  const { mutate: addModel } = useAddModel();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle>Models</CardTitle>
          <SearchModelDialog
            onSelect={(id) => addModel({ jobId: job.id, modelId: id })}
            selected={data?.models || []}
          >
            <Button
              variant={"outline"}
              size={"icon"}
              className="h-6 w-6 ml-auto"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </SearchModelDialog>
        </div>
      </CardHeader>
      <CardContent>
        {isPending || !isSuccess ? (
          <div className="grid gap-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : (
          <ModelTable job={data} />
        )}
      </CardContent>
    </Card>
  );
}
