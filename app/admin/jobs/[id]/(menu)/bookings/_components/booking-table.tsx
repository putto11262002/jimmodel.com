"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteBooking } from "@/hooks/queries/job";
import { Booking } from "@/lib/types/job";
import { formatUTCDateStringWithoutTZ } from "@/lib/utils/date";
import { upperFirst } from "lodash";
import { MoreHorizontal } from "lucide-react";

export default function BookingTable({ bookings }: { bookings: Booking[] }) {
  const { mutate: deleteBooking } = useDeleteBooking();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Start</TableHead>
          <TableHead>End</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.length > 0 ? (
          bookings.map((booking, index) => (
            <TableRow key={index}>
              <TableCell>
                {formatUTCDateStringWithoutTZ(booking.start)}
              </TableCell>
              <TableCell>{formatUTCDateStringWithoutTZ(booking.end)}</TableCell>
              <TableCell>
                <Badge variant={"outline"}>{upperFirst(booking.type)}</Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="w-7 h-7" size={"icon"}>
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() =>
                          deleteBooking({
                            id: booking.id,
                            jobId: booking.jobId,
                          })
                        }
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={4}
              className="text-center text-muted-foreground py-4"
            >
              No bookings found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
