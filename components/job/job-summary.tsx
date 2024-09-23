import { Job } from "@/lib/domains";
import LabelValueItem from "../key-value/key-value-item";
import { Separator } from "../ui/separator";
import { format } from "date-fns";
import Link from "next/link";
import JobStatusBadge from "./job-status-badge";
import JobOwnerBadge from "./job-owner-badge";
import routes from "@/config/routes";

export default function JobSummary({ job }: { job: Job }) {
  return (
    <div className="grid gap-4 overflow-hidden">
      <div className="grid gap-2">
        <Link
          className="hover:underline"
          href={routes.admin.jobs["[id]"].main({ id: job.id })}
        >
          <h1 className="text-lg font-semibold flex items-center gap-1">
            <span>{job.name}</span>
          </h1>
        </Link>
        <LabelValueItem
          label="Status"
          line="break"
          size="sm"
          value={
            <div>
              <JobStatusBadge status={job.status} />
            </div>
          }
        />
        <LabelValueItem
          label="Owner"
          size="sm"
          line="break"
          value={
            <JobOwnerBadge
              owner={{
                name: job.ownerName,
                id: job.ownerId,
                imageId: job.ownerImageId,
              }}
            />
          }
        />

        <LabelValueItem
          label="Created At"
          size="sm"
          line="break"
          value={format(job.createdAt, "dd MMM yyyy HH:mm a")}
        />
      </div>
      <Separator />
      <div className="grid gap-3">
        {/* <h2 className="font-medium">Details</h2> */}

        <LabelValueItem
          size="xs"
          line="break"
          label="Product:"
          value={job.product}
        />

        <LabelValueItem
          size="xs"
          line="break"
          label="Client:"
          value={job.client}
        />

        <LabelValueItem
          size="xs"
          line="break"
          label="Client Address:"
          value={job.clientAddress}
        />

        <LabelValueItem
          size="xs"
          line="break"
          label="Person in Charge:"
          value={job.personInCharge}
        />

        <LabelValueItem
          size="xs"
          line="break"
          label="Person in Charge:"
          value={job.personInCharge}
        />

        <LabelValueItem
          size="xs"
          line="break"
          label="Media Released:"
          value={job.mediaReleased}
        />

        <LabelValueItem
          size="xs"
          line="break"
          label="Period Released:"
          value={job.periodReleased}
        />

        <LabelValueItem
          size="xs"
          line="break"
          label="Territories Released:"
          value={job.territoriesReleased}
        />

        <LabelValueItem
          size="xs"
          line="break"
          label="Working Hour:"
          value={job.workingHour}
        />

        <LabelValueItem
          size="xs"
          line="break"
          label="Venue of Shoot:"
          value={job.venueOfShoot}
        />

        <LabelValueItem
          size="xs"
          line="break"
          label="Fee as Agreed:"
          value={job.feeAsAgreed}
        />

        <LabelValueItem
          size="xs"
          line="break"
          label="Overtime Per Hour:"
          value={job.overtimePerHour}
        />

        <LabelValueItem
          size="xs"
          line="break"
          label="Terms of Payment:"
          value={job.termsOfPayment}
        />

        <LabelValueItem
          size="xs"
          line="break"
          label="Cancellation Fee:"
          value={job.cancellationFee}
        />

        <LabelValueItem
          size="xs"
          line="break"
          label="Contract Details"
          value={job.contractDetails}
        />
      </div>
    </div>
  );
}
