import { Briefcase, Calendar, CircleCheck, Clock, User } from "lucide-react";
import UserAvatar from "@/components/user/user-avatar";
import { Event, EventStragety } from "../calendar";
import { BookingWithJob } from "@/lib/types/job";
import client from "@/lib/api/client";
import dayjs from "dayjs";
import JobStatusBadge from "@/components/job/job-status-badge";
import { Badge } from "@/components/ui/badge";
import { upperFirst } from "lodash";
import Link from "next/link";
import { formatISODateString } from "@/lib/utils/date";

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
            href={`/admin/jobs/update/${this.booking.job.id}`}
          >
            {this.booking.job.name}
          </Link>
        </div>
        <div className="flex gap-4">
          <Badge variant={"outline"}>{upperFirst(this.booking.type)}</Badge>
          <JobStatusBadge status={this.booking.job.status} />
        </div>
        <div className="grid gap-1 text-muted-foreground">
          <p className="text-xs flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-foreground" />
            <span>
              {formatISODateString(this.booking.start.toISOString())} -{" "}
              {formatISODateString(this.booking.end.toISOString())}
            </span>
          </p>
          <p className="text-xs flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-foreground" />
            <span>{this.booking.job.owner.name}</span>
          </p>
          <p className="text-xs flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-foreground" />
            <span>
              {dayjs(this.booking.createdAt).format("DD MMM YY HH:mm a")}
            </span>
          </p>
        </div>
        <ul className="grid gap-2">
          {this.booking.job.models.map((model, index) => (
            <li
              key={index}
              className="flex items-center gap-4 rounded border p-2"
            >
              <UserAvatar
                size={"small"}
                user={{
                  name: model.name,
                  image: model.image ? { id: model.image.fileId } : null,
                }}
              />
              <Link
                href={`/models/update/${model.id}`}
                className="text-sm flex items-center gap-1 hover:underline"
              >
                <span className="">{model.name}</span>{" "}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  renderPreview() {
    return (
      <div className="flex items-center gap-1 h-full">
        {this.booking.job.status === "pending" && (
          <UserAvatar
            rounded
            width={10}
            height={10}
            user={this.booking.job.owner}
          />
        )}
        {this.booking.job.status === "confirmed" && (
          <div>
            <CircleCheck className="h-[10px] w-[10px] text-black" />
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
      },
    });
    const { data } = await res.json();
    return data
      .filter(
        (booking) =>
          booking.status === "pending" || booking.status === "confirmed",
      )
      .map((booking) => new BookingEvent(booking));
  }
}
