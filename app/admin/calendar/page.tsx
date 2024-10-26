"use client";

import Calendar from "@/components/calendar";
import {
  bookingEventLoader,
  BookingEventMetadata,
  BookingPreview,
} from "@/components/calendar/adapters/booking";
import BlockEventMetadata, {
  blockEventLoader,
} from "@/components/calendar/adapters/model-block";

export default function Page() {
  return (
    <>
      {/* <SheetProvider /> */}
      <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] md:h-screen">
        <Calendar
          loaders={[blockEventLoader, bookingEventLoader]}
          eventCardMetadata={{
            booking: BookingEventMetadata,
            block: BlockEventMetadata,
          }}
          extendedEventDataComp={{
            booking: BookingPreview,
          }}
          eventTypePriority={{
            booking: 0,
            block: 1,
          }}
          sortKeyByType={{
            booking: "priority",
          }}
        />
      </div>
    </>
  );
}
