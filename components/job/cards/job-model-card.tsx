"use client";
import { Card } from "@/components/card";
import { Job } from "@/lib/domains";
import JobModelAddDialog from "../dialogs/job-model-add-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IconButton from "@/components/icon-button";
import { CirclePlus } from "lucide-react";
import JobModelCreateAndAddDialog from "../dialogs/job-model-create-and-add-dialog";
import { useState } from "react";
import JobModelEditableTable from "../tables/job-model-editable-table";

export default function JobModelCard({ job }: { job: Job }) {
  const [createAndAddModelOpen, setCreateAndAddModelOpen] = useState(false);
  const [addModelOpen, setAddModelOpen] = useState(false);
  return (
    <Card
      title="Models"
      description="Models associated with this job"
      headerBorder
      action={
        <>
          <JobModelCreateAndAddDialog
            open={createAndAddModelOpen}
            setOpen={setCreateAndAddModelOpen}
            job={job}
          />

          <JobModelAddDialog
            open={addModelOpen}
            setOpen={setAddModelOpen}
            job={job}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                size="sm"
                icon={<CirclePlus className="icon-sm" />}
                text="Model"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setAddModelOpen(true)}>
                Existing Model
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCreateAndAddModelOpen(true)}>
                New Model
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      }
    >
      <JobModelEditableTable jobId={job.id} models={job.jobModels} />
    </Card>
  );
}
