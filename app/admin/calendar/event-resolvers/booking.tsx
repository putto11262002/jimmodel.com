import { CircleCheck, Clock, ExternalLink, User } from "lucide-react";
import UserAvatar from "@/components/user/user-avatar";
import { Event, EventResolver } from "../calendar";
import { BookingWithJob } from "@/lib/types/job";
import jobUsecase from "@/lib/usecases/job";
import client from "../../../../lib/api/client";
import dayjs from "dayjs";
import JobStatusBadge from "../../../../components/job/job-status-badge";
import { Badge } from "../../../../components/ui/badge";
import { upperFirst } from "lodash";
import { Link as LinkIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

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
      <div className="grid gap-3">
        {/* <p className="text-xs text-muted-foreground">{dayjs(this.booking.start).format("HH:mm")} to {dayjs(this.booking.end).format("HH:mm")}</p> */}
        <div className="flex items-center gap-4">
          <p className="font-medium">{this.booking.job.name}</p>
          <Badge variant={"outline"}>{upperFirst(this.booking.type)}</Badge>
          <JobStatusBadge status={this.booking.job.status} />
        </div>
        <div className="grid gap-1 text-muted-foreground">
          <p className="text-xs">
            Time: {dayjs(this.booking.start).format("HH:mm a")} -{" "}
            {dayjs(this.booking.end).format("HH:mm a")}
          </p>
          <p className="text-xs">Booked by: {this.booking.job.owner.name}</p>
          <p className="text-xs">
            Booked at:{" "}
            {dayjs(this.booking.createdAt).format("DD MMM YY HH:mm a")}
          </p>
        </div>
        {/* <div className="flex items-center gap-2 mt-2"> */}
        {/*   <UserAvatar */}
        {/*     rounded */}
        {/*     width={25} */}
        {/*     height={25} */}
        {/*     user={this.booking.job.owner} */}
        {/*   /> */}
        {/*   <div> */}
        {/*     <p className="text-xs"> */}
        {/*       <span>{this.booking.job.owner.name}</span> */}
        {/*       <span> */}
        {/*         {dayjs(this.booking.createdAt).format("DD MMM YY HH:mm")} */}
        {/*       </span> */}
        {/*     </p> */}
        {/*     <p className="text-xs text-muted-foreground"> */}
        {/*       {this.booking.job.owner.email} */}
        {/*     </p> */}
        {/*   </div> */}
        {/* </div> */}
        {/**/}
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
                  image: model.profileImage
                    ? { id: model.profileImage.fileId }
                    : null,
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
    const res = await client.api.bookings.$get({
      query: { start: start.toISOString(), end: end.toISOString() },
    });
    const data = await res.json();
    return data.data

      .filter(
        (booking) =>
          booking.job.status === "pending" ||
          booking.job.status === "confirmed",
      )
      .map((booking) => new BookingEvent(booking));
  }
}
