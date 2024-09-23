"use client";
import DataTable from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Booking } from "@/lib/domains";
import { formatDate } from "@/lib/utils/date";
import { X } from "lucide-react";
import JobStatusBadge from "../job-status-badge";
import useActionState from "@/hooks/use-action-state";
import { deleteBookingAction } from "@/actions/job";
import AsyncButton from "@/components/shared/buttons/async-button";
import { BOOKING_TYPE_LABELS } from "@/db/constants";
import Link from "next/link";
import routes from "@/config/routes";

const columns = [
  { key: "start", header: "Start Date" },
  { key: "end", header: "End Date" },
  { key: "type", header: "Type" },
  { key: "status", header: "Status" },
  { key: "job", header: "Job" },
  { key: "delete", hideHeader: true, align: "right" },
] as const;

export default function BookingTable({
  bookings,
  select,
}: {
  bookings: Booking[];
  select?: { [key in (typeof columns)[number]["key"]]?: boolean };
}) {
  return (
    <DataTable
      border
      rounded
      columns={
        select ? columns.filter((column) => select[column.key]) : columns
      }
      data={bookings.map((booking) => ({
        start: formatDate(booking.start, true),
        end: formatDate(booking.end, true),
        type: (
          <Badge variant="outline">{BOOKING_TYPE_LABELS[booking.type]}</Badge>
        ),
        job: (
          <Link
            className="hover:underline"
            href={routes.admin.jobs["[id]"].main({ id: booking.jobId })}
          >
            {booking.jobName}
          </Link>
        ),
        status: <JobStatusBadge status={booking.status} />,
        delete: <DeleteButton bookingId={booking.id} jobId={booking.jobId} />,
      }))}
    />
  );
}

function DeleteButton({
  bookingId,
  jobId,
}: {
  bookingId: string;
  jobId: string;
}) {
  const { dispatch, pending } = useActionState(deleteBookingAction);
  return (
    <form action={dispatch}>
      <input type="hidden" name="id" value={jobId} />
      <input type="hidden" name="bookingId" value={bookingId} />
      <AsyncButton pending={pending} size="icon" variant="ghost">
        <X className="icon-sm" />
      </AsyncButton>
    </form>
  );
}
