"use client";
import { CardHeader, Card, CardContent, CardTitle } from "@/components/ui/card";
import JobStatusBadge from "@/components/job/job-status-badge";
import { Bell, Calendar, SquareUserRound } from "lucide-react";
import dayjs from "dayjs";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetJob } from "@/hooks/queries/job";

export default function MetadataCard({ jobId }: { jobId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meta Data</CardTitle>
      </CardHeader>
      <CardContent>
        <MetadataCardContent jobId={jobId} />
      </CardContent>
    </Card>
  );
}

function MetadataCardContent({ jobId }: { jobId: string }) {
  const { data, isSuccess } = useGetJob({ jobId });
  if (!isSuccess) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }
  return (
    <div className="grid gap-4">
      <div className="flex gap-4 items-center text-sm">
        <Bell className="h-5 w-5 font-bold" />
        <JobStatusBadge status={data.status} />
      </div>
      <div className="flex gap-4 items-center text-sm">
        <Calendar className="h-5 w-5 font-bold" />
        {dayjs(data.createdAt).format("DD MMM YYYY M:HH A")}
      </div>
      <div className="flex gap-4 items-center text-sm ">
        <SquareUserRound className="h-5 w-5 font-bold" />
        <span className="">{data.owner.name}</span>
      </div>
    </div>
  );
}
