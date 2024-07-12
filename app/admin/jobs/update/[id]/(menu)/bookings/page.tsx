"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import client from "@/lib/api/client";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { upperFirst } from "lodash";
import { Loader, MoreHorizontal, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function Page({ params: { id } }: { params: { id: string } }) {
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
        <PageContent jobId={id} />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

function PageContent({ jobId }: { jobId: string }) {
  const { data, isSuccess } = useQuery({
    queryKey: ["jobs", jobId, "bookings"],
    queryFn: async () => {
      const res = await client.api.jobs[":id"].bookings.$get({
        param: { id: jobId },
        query: {},
      });
      return res.json();
    },
    throwOnError: true,
  });

  const { mutate: deleteBooking } = useDeleteBooking();

  if (!isSuccess) {
    return (
      <div className="p-4 flex justify-center ">
        <Loader className="h-4 w-4 animate-spin" />
      </div>
    );
  }

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
        {data.data.map((booking, index) => (
          <TableRow key={index}>
            <TableCell>
              {dayjs(booking.start).format("DD MMM YY HH:mm")}
            </TableCell>
            <TableCell>
              {dayjs(booking.end).format("DD MMM YY HH:mm")}
            </TableCell>
            <TableCell>
              <Badge variant={"outline"}>{upperFirst(booking.type)}</Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"} size={"icon"}>
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => deleteBooking({ id: booking.id, jobId })}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
