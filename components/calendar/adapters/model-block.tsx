import routes from "@/config/routes";
import { CalendarEvent } from "../types";
import { ModelBlock } from "@/lib/domains";
import LabelValueItem from "@/components/key-value/key-value-item";
import { XCircle } from "lucide-react";

export type BlockEvent = CalendarEvent<"block", { reason: string }>;

export const blockEventLoader = async ({
  start,
  end,
}: {
  start: string;
  end: string;
}): Promise<BlockEvent[]> => {
  const searchParams = new URLSearchParams();
  searchParams.append("start", start);
  searchParams.append("end", end);
  searchParams.append("pagination", "false");
  const res = await fetch(
    `${routes.api["model-blocks"].get}?${searchParams.toString()}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch blocks");
  }
  const data = await res.json();

  const blocks = data.data as ModelBlock[];

  return blocks.map((block) => ({
    start: new Date(block.start),
    end: new Date(block.end),
    reason: block.reason,
    models: [
      {
        name: block.modelName,
        id: block.modelId,
      },
    ],
    type: "block",
    icon: <XCircle className="w-[12px] h-[12px] text-red-800" />,
  }));
};

export default function BlockEventMetadata({ data }: { data: BlockEvent }) {
  return <LabelValueItem label="Reason:" value={data.reason} size="sm" />;
}
