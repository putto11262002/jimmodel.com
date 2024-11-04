import { Card } from "@/components/card";
import IconButton from "@/components/icon-button";
import JobActionCard from "@/components/job/cards/job-action-card";
import JobModelCard from "@/components/job/cards/job-model-card";
import JobPermissionCard from "@/components/job/cards/job-permission-card";
import BookingCreateDialog from "@/components/job/dialogs/booking-create-dialog";
import JobModelAddDialog from "@/components/job/dialogs/job-model-add-dialog";
import JobModelCreateAndAddDialog from "@/components/job/dialogs/job-model-create-and-add-dialog";
import JobGeneralForm from "@/components/job/forms/job-general-form";
import BookingTable from "@/components/job/tables/booking-table";
import JobModelEditableTable from "@/components/job/tables/job-model-editable-table";
import SideMenuLayout from "@/components/layouts/side-menu-layout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/config";
import permissions from "@/config/permission";
import { getBookings, getJobOrThrow } from "@/loaders/job";
import { CirclePlus } from "lucide-react";

const getMenuItems = ({ id }: { id: string }) => [
  { label: "Job", id: "job" },
  {
    label: "Models",
    id: "models",
  },
  { label: "Bookings", id: "bookings" },
  { label: "Actions", id: "actions" },
  { label: "Permissions", id: "permissions" },
];

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth({ permission: permissions.jobs.getJobById });

  const job = await getJobOrThrow(id);
  const { data: bookings } = await getBookings({ jobIds: [id], pageSize: 20 });
  return (
    <SideMenuLayout items={getMenuItems({ id })}>
      <Card
        headerBorder
        title="General"
        description="Basic information about the job"
      >
        <JobGeneralForm job={job} />
      </Card>
      <JobModelCard job={job} />
      <Card
        title="Bookings"
        description="Shotting, Fitting, and other bookings"
        action={
          <BookingCreateDialog
            job={job}
            trigger={
              <IconButton
                size="sm"
                icon={<CirclePlus className="icon-sm" />}
                text="Booking"
              />
            }
          />
        }
        headerBorder
      >
        <BookingTable bookings={bookings} />
      </Card>

      <JobActionCard user={session.user} job={job} />

      <JobPermissionCard user={session.user} job={job} />
    </SideMenuLayout>
  );
}
