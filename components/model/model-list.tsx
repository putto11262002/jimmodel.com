import Avatar from "@/components/avatar";
import { ModelProfile } from "@/lib/types/model";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { JSXElement } from "react-photo-album";
export function ModelProfileListItem({
  model,
  actionComp,
}: {
  model: ModelProfile;
  actionComp?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded border p-2 pr-4">
      <Avatar
        size={"small"}
        name={model.name}
        fileId={model.profileImage?.id}
      />
      <span className="text-sm font-medium">{model.name}</span>{" "}
      <div className="ml-auto">{actionComp}</div>
    </div>
  );
}

export default function ModelProfileList({
  models,
  actionComp,
}: {
  models: ModelProfile[];
  actionComp?: (props: { profile: ModelProfile }) => JSXElement;
}) {
  return (
    <ul className="grid gap-2">
      {models.map((model, index) => (
        <li key={index}>
          <ModelProfileListItem
            actionComp={actionComp ? actionComp({ profile: model }) : undefined}
            model={model}
          />
        </li>
      ))}
    </ul>
  );
}
