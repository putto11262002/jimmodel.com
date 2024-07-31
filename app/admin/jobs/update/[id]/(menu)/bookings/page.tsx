"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import client from "@/lib/api/client";
import { useQuery } from "@tanstack/react-query";
import { Loader, PlusCircle } from "lucide-react";
import Link from "next/link";
import BookingTable from "./_components/booking-table";
import { useGetBookings } from "@/hooks/queries/job";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const { data, isSuccess } = useGetBookings({ jobIds: [id] });

  if (!isSuccess) {
    return (
      <div className="p-4 flex justify-center ">
        <Loader className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Bookings</CardTitle>
        <Link href={`/admin/jobs/update/${id}/bookings/add`}>
          <Button className="h-7 space-x-1" size={"sm"}>
            <PlusCircle className="w-3.5 h-3.5" /> <span>Booking</span>
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <BookingTable bookings={data} />
      </CardContent>
    </Card>
  );
}
