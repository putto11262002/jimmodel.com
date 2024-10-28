"use client";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import routes from "@/config/routes";
import { Application } from "@/lib/domains";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import ApproveApplcationForm from "./forms/approve-application-form";
import RejectApplcationForm from "./forms/reject-application-form";
import { APPLICATION_STATUS } from "@/db/constants";
import ApplicationDeleteForm from "./forms/application-delete-form";

export default function ApplicationDropdownMenu({
  application,
  trigger,
  ...props
}: {
  application: Application;
  trigger: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof DropdownMenuContent>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent {...props}>
        <Link
          href={routes.admin.applications["[id]"].main({
            id: application.id,
          })}
        >
          <DropdownMenuItem>View</DropdownMenuItem>
        </Link>
        {application.modelId && (
          <Link href={routes.admin.models.edit.main(application.modelId)}>
            <DropdownMenuItem>Model</DropdownMenuItem>
          </Link>
        )}
        {application.status === APPLICATION_STATUS.SUBMITTED && (
          <ApproveApplcationForm
            id={application.id}
            trigger={
              <button className="w-full">
                <DropdownMenuItem>Approve</DropdownMenuItem>
              </button>
            }
          />
        )}
        {application.status === APPLICATION_STATUS.SUBMITTED && (
          <RejectApplcationForm
            id={application.id}
            trigger={
              <button className="w-full">
                <DropdownMenuItem>Reject</DropdownMenuItem>
              </button>
            }
          />
        )}

        <ApplicationDeleteForm
          id={application.id}
          trigger={({}) => (
            <button className="w-full">
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </button>
          )}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
