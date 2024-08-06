"use client";
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
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Models</TableHead>
          <TableHead>Created At</TableHead>
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
              <TableCell className="underline">{job.owner.name}</TableCell>
              <TableCell>
                <JobStatusBadge status={job.status} />
              </TableCell>
              <TableCell className="">
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
                              image: model.image
                                ? { id: model.image.fileId }
                                : null,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-background shadow">
                    <ul className="grid gap-2 p-2">
                      {job.models.map((model, index) => (
                        <li key={index} className="flex items-center gap-4">
                          <UserAvatar
                            size={"small"}
                            user={{
                              name: model.name,
                              image: model.image
                                ? { id: model.image.fileId }
                                : null,
                            }}
                          />

                          <span className="text-sm text-foreground">
                            {model.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>
                {dayjs(job.createdAt).format("DD MMM YY HH:mm")}
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Update</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <Link href={`/admin/jobs/update/${job.id}`}>
                            <DropdownMenuItem>Job Info</DropdownMenuItem>
                          </Link>
                          <Link href={`/admin/jobs/update/${job.id}/bookings`}>
                            <DropdownMenuItem>Bookings</DropdownMenuItem>
                          </Link>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    {job.status === "pending" && (
                      <DropdownMenuItem
                        onClick={() => confirm({ jobId: job.id })}
                      >
                        Confirm
                      </DropdownMenuItem>
                    )}
                    {job.status === "confirmed" && (
                      <DropdownMenuItem
                        onClick={() => cancel({ jobId: job.id })}
                      >
                        Cancel
                      </DropdownMenuItem>
                    )}
                    {job.status === "pending" && (
                      <DropdownMenuItem
                        onClick={() => archive({ jobId: job.id })}
                      >
                        Archive
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
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
