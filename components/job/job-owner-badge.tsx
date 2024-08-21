import { Job } from "@/lib/types/job";
import Avatar from "../avatar";
import { Badge } from "../ui/badge";

export default function JobOwnerBadge({ owner }: { owner: Job["owner"] }) {
  return (
    <div className="">
      <div className="flex items-center gap-2">
        <Avatar size={"xs"} name={owner.name} fileId={owner.image?.id} />
        <p className="group-hover:underline font-medium">{owner.name}</p>
      </div>
    </div>
  );
}
