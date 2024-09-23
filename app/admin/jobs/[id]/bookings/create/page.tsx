"use client";
import { Card } from "@/components/card";
import BookingCreateForm from "@/components/job/forms/booking-create-form";
import { useRWDateRange } from "./_components/date-context";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { setState } = useRWDateRange();
  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold">New Booking</h2>
      <Card>
        <BookingCreateForm jobId={id} onChange={setState} />
      </Card>
    </div>
  );
}
