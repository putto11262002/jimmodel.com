"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, PlusCircle } from "lucide-react";
import Link from "next/link";
import BookingTable from "./_components/booking-table";
import { useGetJobBookings } from "@/hooks/queries/job";
import useSession from "@/hooks/use-session";
import permissions from "@/config/permission";
import Loader from "@/components/loader";
import { useBreadcrumbSetter } from "@/components/breadcrumb";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const session = useSession(permissions.jobs.getBookings);

  const { data, isSuccess } = useGetJobBookings({
    enabled: session.status === "authenticated",
    jobId: id,
  });

  useBreadcrumbSetter([
    { label: "Jobs", href: "/admin/jobs" },
    { label: id, href: `/admin/jobs/${id}/update` },
    { label: "Bookings" },
  ]);

  if (!isSuccess) {
    return <Loader />;
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <CardTitle>Bookings</CardTitle>
            <Link
              className="ml-auto block"
              href={`/admin/jobs/${id}/bookings/add`}
            >
              <Button
                variant={"outline"}
                className="h-7 w-7 space-x-1"
                size={"icon"}
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <BookingTable bookings={data} />
        </CardContent>
      </Card>
    </div>
  );
}
