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
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import ApproveApplcationForm from "../forms/approve-application-form";
import ApplicationStatusBadge from "../application-status-badge";
import RejectApplcationForm from "../forms/reject-application-form";
import { APPLICATION_STATUS } from "@/db/constants";

export default function EditableApplicationTable({
  applications,
}: {
  applications: Application[];
}) {
  return (
    <DataTable
      border
      rounded
      columns={
        [
          { key: "name", header: "Name" },
          { key: "email", header: "Email" },
          { key: "status", header: "Status" },
          { key: "submittedAt", header: "Submitted At" },
          { key: "actions", hideHeader: true },
        ] as const
      }
      data={applications.map((application) => ({
        name: application.name,
        email: application.email,
        status: <ApplicationStatusBadge status={application.status} />,
        submittedAt: format(application.submittedAt!, "dd MMM yyyy HH:mm a"),
        actions: (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="icon-md" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }))}
    />
  );
}
