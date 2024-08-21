import { Calendar, CircleX, Clock, SquareX } from "lucide-react";
import { Event, EventStragety } from "../calendar";
import client from "@/lib/api/client";
import { ModelBlockWithModelProfile } from "@/lib/types/model";
import dayjs from "dayjs";
import { formatISODateString } from "@/lib/utils/date";
import { ModelProfileListItem } from "@/components/model/model-list";
import KeyValueItem from "@/components/key-value/key-value-item";

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
          <KeyValueItem
            size={"xs"}
            _key={<Calendar className="w-3.5 h-3.5 text-foreground" />}
            value={`${formatISODateString(this.block.start.toISOString())} - ${formatISODateString(this.block.end.toISOString())}`}
          />
          <KeyValueItem
            size={"xs"}
            _key={<Clock className="w-3.5 h-3.5 text-foreground" />}
            value={dayjs(this.block.createdAt).format("DD MMM YY HH:mm a")}
          />
        </div>

        <ModelProfileListItem model={this.block.model} />
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
