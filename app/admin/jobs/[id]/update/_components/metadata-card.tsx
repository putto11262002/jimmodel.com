"use client";
import { CardHeader, Card, CardContent, CardTitle } from "@/components/ui/card";
import JobStatusBadge from "@/components/job/job-status-badge";
import { Bell, Calendar, SquareUserRound } from "lucide-react";
import dayjs from "dayjs";
import { Job } from "@/lib/types/job";

export default function MetadataCard({ job }: { job: Job }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meta Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex gap-4 items-center text-sm">
            <Bell className="h-5 w-5 font-bold" />
            <JobStatusBadge status={job.status} />
          </div>
          <div className="flex gap-4 items-center text-sm">
            <Calendar className="h-5 w-5 font-bold" />
            {dayjs(job.createdAt).format("DD MMM YYYY M:HH A")}
          </div>
          <div className="flex gap-4 items-center text-sm ">
            <SquareUserRound className="h-5 w-5 font-bold" />
            <span className="">{job.owner.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
