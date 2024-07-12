import { CircleCheck, Clock, User } from "lucide-react";
import UserAvatar from "@/components/user/user-avatar";
import { Event, EventResolver } from "../calendar";
import { BookingWithJob } from "@/lib/types/job";
import jobUsecase from "@/lib/usecases/job";
import client from "../../../../lib/api/client";
import dayjs from "dayjs";
import JobStatusBadge from "../../../../components/job/job-status-badge";
import { Badge } from "../../../../components/ui/badge";
import { upperFirst } from "lodash";

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

  render() {
    return (
      <div className="grid gap-2">
        {/* <p className="text-xs text-muted-foreground">{dayjs(this.booking.start).format("HH:mm")} to {dayjs(this.booking.end).format("HH:mm")}</p> */}
        <div className="flex items-center gap-4">
          <p className="font-medium">{this.booking.job.name}</p>
          <Badge variant={"outline"}>{upperFirst(this.booking.type)}</Badge>
          <JobStatusBadge status={this.booking.job.status} />
        </div>
        <div className="flex items-center gap-2">
          <UserAvatar width={25} height={25} user={this.booking.job.owner} />
          <div>
            <p className="text-xs">
              <span>{this.booking.job.owner.name}</span>
              <span>
                {dayjs(this.booking.createdAt).format("DD MMM YY HH:mm")}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              {this.booking.job.owner.email}
            </p>
          </div>
        </div>

        <p className="text-xs overflow-ellipsis text-nowrap pt-2 flex flex-wrap gap-2">
          {this.booking.job.models.map((model, index) => (
            <div
              className="text-sm font-normal py-1.5 px-2 rounded bg-muted flex items-center gap-2"
              key={index}
            >
              <UserAvatar
                width={25}
                height={25}
                user={{
                  name: model.name,
                  image: model.profileImage
                    ? { id: model.profileImage.fileId }
                    : null,
                }}
              />{" "}
              <span>{model.name}</span>
            </div>
          ))}
        </p>
      </div>
    );
  }
  renderPreview() {
    return (
      <div className="flex items-center gap-2 ">
        {this.booking.job.status === "pending" && (
          <UserAvatar
            rounded
            width={15}
            height={15}
            user={this.booking.job.owner}
          />
        )}
        {this.booking.job.status === "confirmed" && (
          <div>
            <CircleCheck className="h-[15px] w-[15px] text-black" />
          </div>
        )}
        <p className="text-xs overflow-ellipsis text-nowrap">
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

export class BookingResolver implements EventResolver {
  constructor() {}

  async resolve(start: Date, end: Date) {
    const res = await client.api.bookings.range.$get({
      query: { start: start.toISOString(), end: end.toISOString() },
    });
    const bookings = await res.json();
    return bookings

      .filter(
        (booking) =>
          booking.job.status === "pending" ||
          booking.job.status === "confirmed",
      )
      .map((booking) => new BookingEvent(booking));
  }
}
