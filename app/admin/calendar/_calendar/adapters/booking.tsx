import {
  Briefcase,
  Calendar as CalendarIcon,
  CircleCheck,
  Clock,
  ExternalLink,
  User,
} from "lucide-react";
import UserAvatar from "@/components/user/user-avatar";
import { Calendar, Event, EventStragety, GroupedEvents } from "../calendar";
import { BookingWithJob } from "@/lib/types/job";
import client from "@/lib/api/client";
import dayjs from "dayjs";
import JobStatusBadge from "@/components/job/job-status-badge";
import { Badge } from "@/components/ui/badge";
import { cloneDeep, upperFirst } from "lodash";
import Link from "next/link";
import { formatISODateString } from "@/lib/utils/date";
import JobOwnerBadge from "@/components/job/job-owner-badge";
import KeyValueItem from "@/components/key-value/key-value-item";
import ModelProfileList from "@/components/model/model-list";

class BookingEvent implements Event {
  private booking: Omit<BookingWithJob, "start" | "end"> & {
    start: Date;
    end: Date;
  };
  constructor(booking: BookingWithJob) {
    this.booking = {
      ...booking,
      start: new Date(booking.start),
      end: new Date(booking.end),
    };
  }

  public getInteralPriority() {
    let priority = 0;
    if (this.booking.job.status === "confirmed") {
      priority = 1;
    } else if (this.booking.job.status === "pending") {
      priority = 2;
    }
    priority = this.booking.start.getTime();
    return priority;
  }

  public getExternalPriority() {
    return 2;
  }

  render() {
    return (
      <div className="grid gap-3">
        <div className="flex items-center gap-2">
          <Briefcase className="h-[20px] w-[20px]" />
          <Link
            className="hover:underline flex items-baseline font-medium"
            href={`/admin/jobs/${this.booking.job.id}/update`}
          >
            {this.booking.job.name}
          </Link>
        </div>
        <div className="flex gap-4">
          <Badge variant={"outline"}>{upperFirst(this.booking.type)}</Badge>
          <JobStatusBadge status={this.booking.job.status} />
        </div>
        <div className="grid gap-2 text-muted-foreground">
          <KeyValueItem
            size={"xs"}
            _key={<CalendarIcon className="h-4 w-4 text-foreground" />}
            value={`${formatISODateString(this.booking.start.toISOString())} - ${formatISODateString(this.booking.end.toISOString())}`}
          />
          <KeyValueItem
            size="xs"
            _key={<User className="h-4 w-4 text-foreground" />}
            value={<JobOwnerBadge owner={this.booking.job.owner} />}
          />
          <KeyValueItem
            size="xs"
            _key={<Clock className="h-4 w-4 text-foreground" />}
            value={dayjs(this.booking.createdAt).format("DD MMM YY HH:mm a")}
          />
        </div>
        <ModelProfileList
          actionComp={({ profile }) => (
            <Link
              href={`/admin/models/${profile.id}/update`}
              className="ml-auto"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
          models={this.booking.job.models}
        />
      </div>
    );
  }
  renderPreview() {
    return (
      <div className="flex items-center gap-1 h-full">
        {this.booking.job.status === "pending" && (
          <div className="">
            <div className="relative w-[11px] h-[11px]">
              <UserAvatar
                rounded
                width={10}
                height={10}
                user={this.booking.job.owner}
              />
            </div>
          </div>
        )}
        {this.booking.job.status === "confirmed" && (
          <div className="rounded-full flex items-center justify-center">
            <CircleCheck className="h-[10px] w-[10px] p-0 m-0 text-white bg-green-700 rounded-full" />
          </div>
        )}
        <p className="text-[10px] overflow-ellipsis text-nowrap">
          {this.booking.job.models.map((model) => model.name).join(", ")}
        </p>
      </div>
    );
  }
  getEnd() {
    return this.booking.end;
  }

  getStart() {
    return this.booking.start;
  }
}

export class BookingAdapter implements EventStragety {
  constructor() {}

  async get(start: Date, end: Date) {
    const res = await client.api["bookings-with-job"].$get({
      query: {
        start: start.toISOString(),
        end: end.toISOString(),
        pagination: "false",
        statuses: ["pending", "confirmed"],
      },
    });

    const { data } = await res.json();

    const groupedBookings = data.reduce<Record<string, BookingWithJob[]>>(
      (acc, booking) => {
        const start = dayjs(booking.start);
        const end = dayjs(booking.end).add(1, "day");
        let current = start.clone();
        while (current.isBefore(end)) {
          const key = Calendar.getDateKey(current);
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(cloneDeep(booking));
          current = current.add(1, "day");
        }
        return acc;
      },
      {},
    );

    // Sort models by occurance
    Object.entries(groupedBookings).forEach(([key, value]) => {
      const modelOccurance = new Map<string, number>();
      value.forEach((booking) => {
        booking.job.models.forEach((model) =>
          modelOccurance.set(model.id, (modelOccurance.get(model.id) ?? 0) + 1),
        );
      });

      value.forEach((booking) => {
        booking.job.models.sort(
          (a, b) =>
            (modelOccurance.get(b.id) ?? 0) - (modelOccurance.get(a.id) ?? 0),
        );
      });
    });

    const groupedEvents = Object.entries(groupedBookings).reduce<GroupedEvents>(
      (acc, [key, value]) => {
        acc[key] = value.map((booking) => new BookingEvent(booking));
        return acc;
      },
      {},
    );
    return groupedEvents;
  }
}
