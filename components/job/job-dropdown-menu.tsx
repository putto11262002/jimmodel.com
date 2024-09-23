"use client";
import {
  archiveJobAction,
  cancelJobAction,
  confirmJobAction,
} from "@/actions/job";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import routes from "@/config/routes";
import useActionState from "@/hooks/use-action-state";
import { Job } from "@/lib/domains";
import { objToFormData } from "@/lib/utils/form-data";
import Link from "next/link";

export default function JobDropdownMenu({
  job,
  trigger,
}: {
  job: Job;
  trigger: React.ReactNode;
}) {
  const { dispatch: confirmJob } = useActionState(confirmJobAction);
  const { dispatch: cancelJob } = useActionState(cancelJobAction);
  const { dispatch: archiveJob } = useActionState(archiveJobAction);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Edit</DropdownMenuLabel>
        <DropdownMenuGroup>
          <Link
            href={routes.admin.jobs["[id]"].edit.main({
              id: job.id,
            })}
          >
            <DropdownMenuItem>General</DropdownMenuItem>
          </Link>

          <Link
            href={routes.admin.jobs["[id]"].edit.client({
              id: job.id,
            })}
          >
            <DropdownMenuItem>Client</DropdownMenuItem>
          </Link>

          <Link
            href={routes.admin.jobs["[id]"].edit.production({
              id: job.id,
            })}
          >
            <DropdownMenuItem>Production</DropdownMenuItem>
          </Link>

          <Link
            href={routes.admin.jobs["[id]"].edit.contract({
              id: job.id,
            })}
          >
            <DropdownMenuItem>Contract</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link
          href={routes.admin.jobs["[id]"].models({
            id: job.id,
          })}
        >
          <DropdownMenuItem>Models</DropdownMenuItem>
        </Link>
        <Link
          href={routes.admin.jobs["[id]"].bookings({
            id: job.id,
          })}
        >
          <DropdownMenuItem>Bookings</DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuGroup>
          {job.status === "pending" && (
            <DropdownMenuItem
              onClick={() => confirmJob(objToFormData({ id: job.id }))}
            >
              Confirm
            </DropdownMenuItem>
          )}

          {job.status === "confirmed" && (
            <DropdownMenuItem
              onClick={() => cancelJob(objToFormData({ id: job.id }))}
            >
              Cancel
            </DropdownMenuItem>
          )}

          {job.status === "pending" && (
            <DropdownMenuItem
              onClick={() => archiveJob(objToFormData({ id: job.id }))}
            >
              Archive
            </DropdownMenuItem>
          )}
          <a
            href={routes.api.jobs["[id]"]["confirmation-sheet"].get({
              id: job.id,
            })}
            download
          >
            <DropdownMenuItem>Download</DropdownMenuItem>
          </a>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
