import { CircleCheck, CircleX, Clock, User } from "lucide-react";
import UserAvatar from "@/components/user/user-avatar";
import { Event, EventResolver } from "../calendar";
import { BookingWithJob } from "@/lib/types/job";
import jobUsecase from "@/lib/usecases/job";
import client from "../../../../lib/api/client";
import dayjs from "dayjs";
import JobStatusBadge from "../../../../components/job/job-status-badge";
import { Badge } from "../../../../components/ui/badge";
import { upperFirst } from "lodash";
import { ModelBlock, ModelBlockWithModel } from "@/lib/types/model";

class BlockEvent implements Event {
  private block: Omit<ModelBlockWithModel, "start" | "end"> & {
    start: Date;
    end: Date;
  };
  constructor(block: ModelBlockWithModel) {
    this.block = {
      ...block,
      start: new Date(block.start),
      end: new Date(block.end),
    };
  }

  render() {
    return (
      <div className="grid gap-2">
        {/* <p className="text-xs text-muted-foreground">{dayjs(this.booking.start).format("HH:mm")} to {dayjs(this.booking.end).format("HH:mm")}</p> */}
        <div className="flex items-center gap-2">
          <CircleX className="text-red-800 h-[20px] w-[20px]" />
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

        <p className="text-sm">{this.block.reason}</p>

        {/* <p className="text-xs overflow-ellipsis text-nowrap pt-2 flex flex-wrap gap-2"> */}
        {/*   {this.booking.job.models.map((model, index) => ( */}
        {/*     <div */}
        {/*       className="text-sm font-normal py-1.5 px-2 rounded bg-muted flex items-center gap-2" */}
        {/*       key={index} */}
        {/*     > */}
        {/*       <UserAvatar */}
        {/*         width={25} */}
        {/*         height={25} */}
        {/*         user={{ */}
        {/*           name: model.name, */}
        {/*           image: model.profileImage */}
        {/*             ? { id: model.profileImage.fileId } */}
        {/*             : null, */}
        {/*         }} */}
        {/*       />{" "} */}
        {/*       <span>{model.name}</span> */}
        {/*     </div> */}
        {/*   ))} */}
        {/* </p> */}
      </div>
    );
  }

  renderPreview() {
    return (
      <div className="flex items-center gap-2 ">
        <CircleX className="h-[15px] w-[15px] text-red-800" />
        <p className="text-xs overflow-ellipsis text-nowrap">
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
      query: { start: start.toISOString(), end: end.toISOString() },
    });
    const blocks = await res.json();
    return blocks.map((block) => new BlockEvent(block));
  }
}
