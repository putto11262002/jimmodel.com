import Loader from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetBlock, useGetBlockWithModeProfile } from "@/hooks/queries/model";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { formatISODateString, milisecondToHour } from "@/lib/utils/date";
import { useGetJob } from "@/hooks/queries/job";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircleCheck } from "lucide-react";
import { Job } from "@/lib/types/job";

const BlockCard = memo(
  ({ start, end, job }: { start?: Date; end?: Date; job: Job }) => {
    const enabled = Boolean(
      start &&
        end &&
        job &&
        milisecondToHour(end.getTime() - start.getTime()) > 0,
    );

    const { isFetching, data } = useGetBlockWithModeProfile({
      start,
      end,
      modelIds: job?.models.map((m) => m.id)!,
      enabled,
    });
    const hasBlocks = data?.data && data?.data?.length > 0;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            Blocks
            {enabled && (
              <Badge
                variant={"outline"}
                className={cn(
                  "ml-4",
                  !hasBlocks && "bg-green-100 text-green-800",
                  hasBlocks && "bg-red-100 text-red-800",
                  isFetching && "bg-yellow-100 text-yellow-800",
                )}
              >
                {isFetching ? "Calulating" : hasBlocks ? "Dangerous" : "OK"}
              </Badge>
            )}
          </CardTitle>

          <CardDescription>
            List of blocks on the models related to the job
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isFetching ? (
                hasBlocks ? (
                  data.data.map((block, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatISODateString(block.start)}</TableCell>
                      <TableCell>{formatISODateString(block.end)}</TableCell>
                      <TableCell>{block.model.name}</TableCell>
                      <TableCell>{block.reason}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="py-4">
                      <p className="flex items-center justify-center text-center  gap-2">
                        <CircleCheck className="h-4 w-4 text-green-800" />{" "}
                        <span>No Blocks</span>
                      </p>
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-4">
                    <Loader />
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

export default BlockCard;
