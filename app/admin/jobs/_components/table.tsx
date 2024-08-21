"use client";
import JobOwnerBadge from "@/components/job/job-owner-badge";
import JobStatusBadge from "@/components/job/job-status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TableHead,
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserAvatar from "@/components/user/user-avatar";
import { useArchive, useCancelJob, useConfrirmJob } from "@/hooks/queries/job";
import { Job } from "@/lib/types/job";
import { formatISODateString } from "@/lib/utils/date";
import dayjs from "dayjs";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default function JobTable({ jobs }: { jobs: Job[] }) {
  const { mutate: confirm } = useConfrirmJob();
  const { mutate: cancel } = useCancelJob();
  const { mutate: archive } = useArchive();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="hidden md:table-cell">Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">Models</TableHead>
          <TableHead className="hidden md:table-cell">Created At</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.name}</TableCell>
              <TableCell className="hidden md:table-cell">
                <JobOwnerBadge owner={job.owner} />
              </TableCell>
              <TableCell>
                <JobStatusBadge status={job.status} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      {job.models.map((model, index) => (
                        <div
                          style={{
                            transform: `translateX(-${index * 10}px)`,
                            zIndex: index,
                          }}
                          className="shadow"
                          key={index}
                        >
                          <UserAvatar
                            size={"small"}
                            user={{
                              name: model.name,
                              image: model.profileImage
                                ? { id: model.profileImage.id }
                                : null,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-background shadow p-2">
                    <ul className="grid gap-2">
                      {job.models.map((model, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <UserAvatar
                            size={"small"}
                            user={{
                              name: model.name,
                              image: model.profileImage
                                ? { id: model.profileImage.id }
                                : null,
                            }}
                          />

                          <span className="text-sm font-medium text-foreground">
                            {model.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell className="whitespace-nowrap hidden md:table-cell">
                {formatISODateString(job.createdAt)}
              </TableCell>

              <TableCell>
                <Link href={`/admin/jobs/${job.id}/update`}>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={6}
              className="py-4 text-center text-muted-foreground"
            >
              No results
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
