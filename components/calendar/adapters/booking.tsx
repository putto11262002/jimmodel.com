import useSWR from "swr";
import { Booking, Job, UserWithoutSecrets } from "@/lib/domains";
import { Skeleton } from "@/components/ui/skeleton";
import Alert from "@/components/alert";
import JobSummary from "@/components/job/job-summary";
import { CalendarEvent } from "../types";
import routes from "@/config/routes";
import JobStatusBadge from "@/components/job/job-status-badge";
import LabelValueItem from "@/components/key-value/key-value-item";
import { CheckCircle } from "lucide-react";
import Avatar from "@/components/avatar";
import { BOOKING_TYPE_LABELS, JOB_STATUS } from "@/db/constants";
import { Badge } from "@/components/ui/badge";

export type BookingEvent = CalendarEvent<
  "booking",
  {
    jobId: string;
    bookingType: Booking["type"];
    bookingStatus: Booking["status"];
    priority: number;
    ownerName: string;
    ownerId: string;
    ownerImage: string | null;
  }
>;

export const bookingEventLoader = async ({
  start,
  end,
}: {
  start: string;
  end: string;
}): Promise<BookingEvent[]> => {
  const searchParams = new URLSearchParams();
  searchParams.append("start", start);
  searchParams.append("end", end);
  searchParams.append("pagination", "false");
  searchParams.append("statuses", JOB_STATUS.PENDING);
  searchParams.append("statuses", JOB_STATUS.CONFIRMED);
  const res = await fetch(
    `${routes.api.bookings.get}?${searchParams.toString()}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch bookings");
  }
  const data = await res.json();

  const bookings = data.data as Booking[];

  const jobIds = new Set(bookings.map((booking) => booking.jobId));

  const jobSearchParams = new URLSearchParams();
  jobIds.forEach((jobId) => jobSearchParams.append("jobIds", jobId));
  const jobRes = await fetch(
    `${routes.api.jobs.get}?${jobSearchParams.toString()}`
  );
  if (!jobRes.ok) {
    throw new Error("Failed to fetch jobs");
  }
  const jobs = await jobRes.json().then((res) => res.data as Job[]);

  return bookings
    .map((booking) => {
      const job = jobs.find((job) => job.id === booking.jobId);
      if (!job) {
        return undefined;
      }

      return {
        start: new Date(booking.start),
        end: new Date(booking.end),
        models:
          job?.jobModels.map((model) => ({
            name: model.modelName,
            id: model.modelId,
          })) ?? [],
        type: "booking" as const,
        jobId: booking.jobId,
        bookingType: booking.type,
        bookingStatus: booking.status,
        priority: booking.status === JOB_STATUS.CONFIRMED ? 1 : 0,
        ownerName: job.ownerName,
        ownerId: job.ownerId,
        ownerImage: job.ownerImageId,
        icon:
          booking.status === JOB_STATUS.CONFIRMED ? (
            <div>
              <CheckCircle className="w-[12px] h-[12px] text-green-800" />
            </div>
          ) : (
            <div className="w-[12px] h-[12px] border">
              <Avatar
                size="xxs"
                fileId={job.ownerImageId}
                name={job.ownerName}
              />
            </div>
          ),
      };
    })
    .filter((event) => event !== undefined);
};

export function BookingEventMetadata({ data }: { data: BookingEvent }) {
  return (
    <div className="grid gap-2">
      <LabelValueItem
        label="Booking Type:"
        value={
          <Badge variant="outline">
            {BOOKING_TYPE_LABELS[data.bookingType]}
          </Badge>
        }
        size="sm"
      />

      <LabelValueItem label="Owner:" value={data.ownerName} size="sm" />

      <LabelValueItem
        label="Status:"
        value={<JobStatusBadge status={data.bookingStatus} />}
        size="sm"
      />
    </div>
  );
}

export const BookingPreview = ({ data }: { data: BookingEvent }) => {
  const {
    data: job,
    isLoading,
    error,
  } = useSWR<Job, Error, string>("/api/jobs/" + data.jobId, async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch job");
    }
    const data = await res.json();
    return data as Job;
  });

  const {
    data: owner,
    isLoading: ownerLoading,
    error: ownerError,
  } = useSWR<UserWithoutSecrets, Error, () => string | false>(
    () => (job ? "/api/users/" + job?.ownerId : false),
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch owner");
      }
      const data = await res.json();
      return data as UserWithoutSecrets;
    }
  );

  if (ownerError) {
    return <Alert variant="error">{ownerError.message}</Alert>;
  }

  if (error) {
    return <Alert variant="error">{error.message}</Alert>;
  }
  if (isLoading || !job || ownerLoading || !owner) {
    return <Skeleton className="h-6 w-2/3" />;
  }

  return <JobSummary job={job} />;
};
