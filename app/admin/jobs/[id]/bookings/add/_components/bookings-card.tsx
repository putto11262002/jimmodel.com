import { useJobPreview } from "@/components/job/job-preview-sheet";
import JobStatusBadge from "@/components/job/job-status-badge";
import Loader from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetConflictingBookings } from "@/hooks/queries/job";
import { cn } from "@/lib/utils";
import {
  formatUTCDateStringWithoutTZ,
  milisecondToHour,
} from "@/lib/utils/date";
import { CircleCheck, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

const BookingsCard = memo(
  ({ start, end, jobId }: { start?: Date; end?: Date; jobId: string }) => {
    const enabled = Boolean(
      start && end && milisecondToHour(end.getTime() - start.getTime()) > 0,
    );

    const { preview } = useJobPreview();

    const { data, isFetching } = useGetConflictingBookings({
      start: start || new Date(),
      end: end || new Date(),
      jobId,
      enabled,
    });

    const hasBookings = data && data.length > 0;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            Bookings
            {enabled && (
              <Badge
                variant={"outline"}
                className={cn(
                  "ml-4",
                  !hasBookings && "bg-green-100 text-green-800",
                  hasBookings && "bg-red-100 text-red-800",
                  isFetching && "bg-yellow-100 text-yellow-800",
                )}
              >
                {isFetching ? "Calulating" : hasBookings ? "Dangerous" : "OK"}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            List of job bookings that contains the same models and falls in the
            selected date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching ? (
                <TableRow className="">
                  <TableCell colSpan={6} className="">
                    <Loader />
                  </TableCell>
                </TableRow>
              ) : hasBookings ? (
                data.map((conflict) => (
                  <TableRow key={conflict.id}>
                    <TableCell>
                      {formatUTCDateStringWithoutTZ(conflict.start)}
                    </TableCell>
                    <TableCell>
                      {formatUTCDateStringWithoutTZ(conflict.end)}
                    </TableCell>
                    <TableCell>
                      <JobStatusBadge status={conflict.status} />
                    </TableCell>
                    <TableCell>
                      {/* <Link href={`/admin/jobs/${conflict.jobId}/update`}> */}
                      <Button
                        onClick={() => preview(conflict.jobId)}
                        size={"icon"}
                        variant={"ghost"}
                      >
                        <SquareArrowOutUpRight className="w-4 h-4" />
                      </Button>
                      {/* </Link> */}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    <p className="flex items-center justify-center gap-2">
                      <CircleCheck className="h-4 w-4 text-green-800" />{" "}
                      <span>No Conflicting Bookings</span>
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  },
);

export default BookingsCard;
