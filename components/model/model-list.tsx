import Avatar from "@/components/avatar";
import { ModelProfile } from "@/lib/types/model";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
export function ModelProfileListItem({ model }: { model: ModelProfile }) {
  return (
    <div className="flex items-center gap-4 rounded border p-2 pr-4">
      <Avatar
        size={"small"}
        name={model.name}
        fileId={model.profileImage?.id}
      />
      <span className="text-sm font-medium">{model.name}</span>{" "}
      <Link href={`/models/${model.id}/update`} className="ml-auto">
        <ExternalLink className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function ModelProfileList({
  models,
}: {
  models: ModelProfile[];
}) {
  return (
    <ul className="grid gap-2">
      {models.map((model, index) => (
        <li key={index}>
          <ModelProfileListItem model={model} />
        </li>
      ))}
    </ul>
  );
}
