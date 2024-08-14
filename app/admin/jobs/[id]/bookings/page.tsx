"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import BookingTable from "./_components/booking-table";
import { useGetJobBookings } from "@/hooks/queries/job";
import Container from "@/components/container";
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
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  return (
    <Container className="grid gap-4">
      <div>
        <Link className="ml-auto block" href={`/admin/jobs/${id}/bookings/add`}>
          <Button className="h-7 space-x-1" size={"sm"}>
            <PlusCircle className="w-3.5 h-3.5" /> <span>Booking</span>
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingTable bookings={data} />
        </CardContent>
      </Card>
    </Container>
  );
}
