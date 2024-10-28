"use client";
import Avatar from "@/components/avatar";
import { DataList } from "@/components/list";
import routes from "@/config/routes";
import { CompactModel } from "@/lib/domains/types";
import Link from "next/link";

export default function ModelList({
  models,
  action,
}: {
  models: (Pick<CompactModel, "name" | "profileImageId"> & {
    id: string | null;
  })[];
  action?: ({ modelId }: { modelId: string | null }) => React.ReactNode;
}) {
  return (
    <DataList
      data={models}
      renderItem={(model) => {
        return (
          <div className="flex items-center gap-4">
            <Avatar
              size={"sm"}
              name={model.name}
              fileId={model.profileImageId}
            />
            <Link
              href={
                model.id
                  ? routes.admin.models["[id]"].main({ id: model.id })
                  : "#"
              }
              className="hover:underline text-sm font-medium"
            >
              {model.name}
            </Link>{" "}
            <div className="ml-auto">
              {action && action({ modelId: model.id })}
            </div>
          </div>
        );
      }}
    />
  );
}
