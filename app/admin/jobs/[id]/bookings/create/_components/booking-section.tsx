"use client";
import { Booking, Job } from "@/lib/domains";
import useSWR from "swr";
import { useRDateRange } from "../_components/date-context";
import BookingTable from "@/components/job/tables/booking-table";
import { Skeleton } from "@/components/ui/skeleton";
import Alert from "@/components/alert";

export default function BookingSection({ job }: { job: Job }) {
  const { start, end, valid } = useRDateRange();
  const { data, isLoading, error } = useSWR(
    valid && start && end
      ? {
          url: "/api/bookings",
          start,
          end,
          valid,
        }
      : false,
    (arg) => {
      if (!arg.valid || !start || !end) return [];

      const searchParams = new URLSearchParams();

      searchParams.set("start", start.toISOString());
      searchParams.set("end", end.toISOString());
      job.jobModels.forEach(
        (model) =>
          model.modelId && searchParams.append("modelIds", model.modelId)
      );
      return fetch(`${arg.url}?${searchParams.toString()}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("failed to fetch");
          }
          return res.json();
        })
        .then((data) => data.data as Booking[]);
    }
  );
  if (error) return <Alert variant="error">Failed to load bookings</Alert>;
  if (isLoading || !data) return <Skeleton className="h-6 w-full rounded-lg" />;

  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold">Conflicting Bookings</h2>
      <BookingTable
        bookings={data}
        select={{ start: true, end: true, type: true, status: true, job: true }}
      />
    </div>
  );
}
