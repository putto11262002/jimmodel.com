"use client";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetModelBlocks } from "@/hooks/queries/model";
import dayjs from "dayjs";
import { ChevronLeft, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const { id } = useParams<{ id: string }>();

  const { data, isSuccess } = useGetModelBlocks({ modelId: id });

  const router = useRouter();

  return (
    <Container>
      <div className="flex gap-4 items-center">
        <Button onClick={() => router.back()} variant={"outline"} size={"icon"}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-2xl font-semibold">Blocks</h2>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSuccess
              ? data?.map((block, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {dayjs(block.start).format("DD MMM YY HH:mm")}
                    </TableCell>
                    <TableCell>
                      {dayjs(block.end).format("DD MMM YY HH:mm")}
                    </TableCell>
                    <TableCell>{block.reason}</TableCell>
                    <TableCell>
                      <Button
                        variant={"outline"}
                        size={"icon"}
                        className="w-7 h-7"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : new Array(5).fill(null).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={4}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
