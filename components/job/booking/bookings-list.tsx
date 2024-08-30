import KeyValueItem from "@/components/key-value/key-value-item";
import { Badge } from "@/components/ui/badge";
import { Booking } from "@/lib/types/job";
import { formatISODateString } from "@/lib/utils/date";
import { upperFirst } from "lodash";

export default function ({ bookings }: { bookings: Booking[] }) {
  return (
    <ul className="grid gap-2">
      {bookings.map((booking, index) => (
        <li key={index} className="grid gap-1 relative rounded border p-4">
          <div className="absolute top-2 right-4">
            <Badge variant={"outline"}>{upperFirst(booking.type)}</Badge>
          </div>
          <div className="text-sm grid gap-1">
            <KeyValueItem
              lineBreak
              _key={"Start - End"}
              value={`${formatISODateString(booking.start)} - ${formatISODateString(booking.end)}`}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
