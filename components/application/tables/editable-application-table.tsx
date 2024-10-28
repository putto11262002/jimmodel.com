"use client";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Application } from "@/lib/domains";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import ApplicationStatusBadge from "../application-status-badge";
import ApplicationDropdownMenu from "../application-dropdown-menu";

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
          <ApplicationDropdownMenu
            application={application}
            trigger={
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="icon-md" />
              </Button>
            }
          />
        ),
      }))}
    />
  );
}
