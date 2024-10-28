import Avatar from "@/components/avatar";
import DataTable from "@/components/data-table";
import JobDropdownMenu from "@/components/job/job-dropdown-menu";
import JobOwnerBadge from "@/components/job/job-owner-badge";
import JobStatusBadge from "@/components/job/job-status-badge";
import { Button } from "@/components/ui/button";
import routes from "@/config/routes";
import { Job } from "@/lib/domains";
import { formatDate } from "@/lib/utils/date";
import { truncate } from "lodash";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default function JobTable({ jobs }: { jobs: Job[] }) {
  return (
    <DataTable
      rounded
      border
      shadow
      data={jobs.map((job) => {
        const displayModels =
          job.jobModels.length > 3 ? job.jobModels.slice(0, 3) : job.jobModels;
        const hidddenModels = job.jobModels.length - displayModels.length;
        return {
          name: (
            <span className="font-semibold">
              {truncate(job.name, { length: 20 })}
            </span>
          ),
          status: <JobStatusBadge status={job.status} />,
          owner: (
            <JobOwnerBadge
              owner={{
                id: job.ownerId,
                name: job.ownerName,
                imageId: job.ownerImageId,
              }}
            />
          ),
          models: (
            <ul className="flex items-center gap-2">
              {displayModels.length > 0 ? (
                displayModels.map((_model, index) => {
                  return (
                    <li key={index} className="flex items-center gap-2">
                      <Link
                        href={
                          _model.modelId
                            ? routes.admin.models["[id]"].main({
                                id: _model.modelId,
                              })
                            : "#"
                        }
                      >
                        <Avatar
                          size={"sm"}
                          fileId={_model.modelImageId}
                          name={_model.modelName}
                        />
                      </Link>
                    </li>
                  );
                })
              ) : (
                <li className="text-sm text-muted-foreground">No Models</li>
              )}
              {hidddenModels > 0 && (
                <div className="h-6 w-6 flex justify-center items-center rounded-full bg-accent text-[10px] text-muted-foreground font-semibold">
                  +{hidddenModels}
                </div>
              )}
            </ul>
          ),
          createdAt: formatDate(job.createdAt),
          action: (
            <JobDropdownMenu
              job={job}
              trigger={
                <Button size="icon" variant="ghost">
                  <MoreHorizontal className="icon-md" />
                </Button>
              }
            />
          ),
        };
      })}
      columns={
        [
          { key: "name", header: "Name" },
          { key: "owner", header: "Owner", display: "md" },
          { key: "models", header: "Models", display: "md" },
          { key: "status", header: "Status" },
          { key: "createdAt", header: "Created At", display: "md" },
          {
            key: "action",
            header: "",
            hideHeader: true,
            align: "right",
          },
        ] as const
      }
    />
  );
}
