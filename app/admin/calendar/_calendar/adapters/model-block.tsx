import { Calendar, CircleX, Clock, SquareX } from "lucide-react";
import { Event, EventStragety } from "../calendar";
import client from "@/lib/api/client";
import { ModelBlockWithModelProfile } from "@/lib/types/model";
import dayjs from "dayjs";
import UserAvatar from "@/components/user/user-avatar";
import Link from "next/link";
import { formatISODateString } from "@/lib/utils/date";

class BlockEvent implements Event {
  private block: Omit<ModelBlockWithModelProfile, "start" | "end"> & {
    start: Date;
    end: Date;
  };
  constructor(block: ModelBlockWithModelProfile) {
    this.block = {
      ...block,
      start: new Date(block.start),
      end: new Date(block.end),
    };
  }

  getExternalPriority() {
    return 1;
  }

  getInteralPriority() {
    return this.block.start.getTime();
  }

  render() {
    return (
      <div className="grid gap-3">
        <div className="flex items-center gap-2">
          <SquareX className="text-red-800 h-[20px] w-[20px]" />
          <p className="font-medium">{this.block.reason}</p>
        </div>
        <div className="grid gap-1 text-muted-foreground">
          <p className="text-xs flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-foreground" />
            {formatISODateString(this.block.start.toISOString())} -{" "}
            {formatISODateString(this.block.end.toISOString())}
          </p>
          <p className="text-xs flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-foreground" />
            {dayjs(this.block.createdAt).format("DD MMM YY HH:mm a")}
          </p>
        </div>
        <div className="flex items-center gap-4 rounded border p-2">
          <UserAvatar
            size={"small"}
            user={{
              name: this.block.model.name,
              image: this.block.model.image
                ? { id: this.block.model.image.fileId }
                : null,
            }}
          />
          <Link
            href={`/models/update/${this.block.model.id}`}
            className="text-sm flex items-center gap-1 hover:underline"
          >
            <span className="">{this.block.model.name}</span>{" "}
          </Link>
        </div>
      </div>
    );
  }

  renderPreview() {
    return (
      <div className="flex items-center gap-1">
        <div>
          <CircleX className="h-[10px] w-[10px] text-red-800" />
        </div>
        <p className="text-[10px] overflow-ellipsis text-nowrap">
          {this.block.model.name}
        </p>
      </div>
    );
  }
  getEnd() {
    return this.block.end;
  }

  getStart() {
    return this.block.start;
  }
}

export class BlockAdapter implements EventStragety {
  constructor() {}

  async get(start: Date, end: Date) {
    const res = await client.api["blocks-with-model-profile"].$get({
      query: {
        start: start.toISOString(),
        end: end.toISOString(),
        pagination: "false",
      },
    });
    const { data } = await res.json();
    return data.map((block) => new BlockEvent(block));
  }
}
