"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  useApproveApplication,
  useRejectApplication,
} from "@/hooks/queries/application";
import { Application } from "@/lib/types/application";
import dayjs from "dayjs";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default function ApplicationTable({
  applications,
}: {
  applications: Application[];
}) {
  const { mutate: approve } = useApproveApplication();
  const { mutate: reject } = useRejectApplication();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Submited At</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.length > 0 ? (
          applications.map((application, index) => (
            <TableRow key={index}>
              <TableCell>{application.name}</TableCell>
              <TableCell>{application.email}</TableCell>
              <TableCell>
                {dayjs(application.createdAt).format("DD MMM YY HH:mm a")}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"outline"} size={"icon"}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Link href={`/admin/applications/view/${application.id}`}>
                      <DropdownMenuItem>View</DropdownMenuItem>
                    </Link>
                    {application.status !== "approved" && (
                      <DropdownMenuItem
                        onClick={() =>
                          approve({ applicationId: application.id })
                        }
                      >
                        Approve
                      </DropdownMenuItem>
                    )}
                    {application.status === "pending" && (
                      <DropdownMenuItem
                        onClick={() =>
                          reject({ applicationId: application.id })
                        }
                      >
                        Reject
                      </DropdownMenuItem>
                    )}

                    {application.status === "approved" && (
                      <Link
                        href={`/admin/models/${application.id}/update/general`}
                      >
                        <DropdownMenuItem>Model Profile</DropdownMenuItem>
                      </Link>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={4}
              className="py-4 text-center text-muted-foreground"
            >
              No application
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
