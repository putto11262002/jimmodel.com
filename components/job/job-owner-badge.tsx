import { UserWithoutSecrets } from "@/lib/domains";
import Avatar, { AvatarProps } from "../avatar";
import { truncate } from "lodash";
import Link from "next/link";
import routes from "@/config/routes";

export default function JobOwnerBadge({
  owner,
}: {
  owner: Pick<UserWithoutSecrets, "name" | "id" | "imageId">;
}) {
  return (
    <div className="">
      <div className="flex items-center gap-2">
        <Avatar size={"sm"} name={owner.name} fileId={owner.imageId} />
        <div className="flex flex-col justify-between">
          <p className="group-hover:underline font-medium text-sm">
            {truncate(owner.name, { length: 18 })}
          </p>

          <Link href={"#"} className="text-xs text-muted-foreground">
            {truncate(owner.id, { length: 18 })}
          </Link>
        </div>
      </div>
    </div>
  );
}
