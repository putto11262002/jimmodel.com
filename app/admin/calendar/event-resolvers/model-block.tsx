import { CircleX, SquareX } from "lucide-react";
import { Event, EventResolver } from "../calendar";
import client from "../../../../lib/api/client";
import {
  ModelBlockWithModel,
  ModelBlockWithPartialModel,
} from "@/lib/types/model";
import dayjs from "dayjs";

class BlockEvent implements Event {
  private block: Omit<ModelBlockWithPartialModel, "start" | "end"> & {
    start: Date;
    end: Date;
  };
  constructor(block: ModelBlockWithPartialModel) {
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
      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <SquareX className="text-red-800 h-[20px] w-[20px]" />
          <p className="font-medium">{this.block.model.name}</p>
        </div>
        {/* <div className="flex items-center gap-2"> */}
        {/*   <UserAvatar width={25} height={25} user={this.bl.job.owner} /> */}
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

        {/* <div className="text-sm font-normal py-1.5 px-2 rounded bg-muted flex items-center gap-2"> */}
        {/*   <UserAvatar */}
        {/*     width={25} */}
        {/*     height={25} */}
        {/*     user={{ */}
        {/*       name: this.block.model.name, */}
        {/*       image: this.block.model.profileImage */}
        {/*         ? { id: this.block.model.profileImage.fileId } */}
        {/*         : null, */}
        {/*     }} */}
        {/*   />{" "} */}
        {/*   <span>{this.block.model.name}</span> */}
        {/* </div> */}
        <div className="grid gap-1 text-muted-foreground">
          <p className="text-xs">
            Time: {dayjs(this.block.start).format("HH:mm a")} -{" "}
            {dayjs(this.block.end).format("HH:mm a")}
          </p>
          <p className="text-xs">
            Created at:{" "}
            {dayjs(this.block.createdAt).format("DD MMM YY HH:mm a")}
          </p>
        </div>

        <p className="text-sm">{this.block.reason}</p>
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

export class BlockResolver implements EventResolver {
  constructor() {}

  async resolve(start: Date, end: Date) {
    const res = await client.api.blocks.$get({
      query: {
        start: start.toISOString(),
        end: end.toISOString(),
        include: ["model"],
      },
    });
    const blocks = (await res.json()) as ModelBlockWithPartialModel[];
    return blocks.map((block) => new BlockEvent(block));
  }
}
