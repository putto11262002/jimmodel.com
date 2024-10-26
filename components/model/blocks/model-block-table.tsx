"use client";
import { deleteModelBlockAction } from "@/actions/model";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import routes from "@/config/routes";
import useActionToast from "@/hooks/use-action-toast";
import { ModelBlock } from "@/lib/domains";
import { formatDate } from "@/lib/utils/date";
import { objToFormData } from "@/lib/utils/form-data";
import { Loader2, X } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";

const columns = [
  { key: "start", header: "Start" },
  { key: "end", header: "End" },
  { key: "reason", header: "Reason" },
  { key: "model", header: "Model" },
  { key: "delete", hideHeader: true, align: "right" },
] as const;

export default function ModelBlockTable({
  blocks,
  select,
}: {
  blocks: ModelBlock[];
  select?: { [key in (typeof columns)[number]["key"]]?: boolean };
}) {
  const [state, action, pending] = useActionState(deleteModelBlockAction, {
    status: "idle",
  });
  const [deletingBlockId, setDeletingBlockId] = useState<string | null>(null);
  useActionToast({ state });
  useEffect(() => {
    if (state.status === "success") {
      setDeletingBlockId(null);
    }
  }, [state.status]);
  return (
    <DataTable
      border
      rounded
      columns={select ? columns.filter((col) => select[col.key]) : columns}
      data={blocks.map((block) => ({
        start: formatDate(block.start, true),
        end: formatDate(block.end, true),
        reason: block.reason,
        model: (
          <Link
            className="hover:underline"
            href={routes.admin.models["[id]"].main({ id: block.modelId })}
          >
            {block.modelName}
          </Link>
        ),
        delete: (
          <Button
            onClick={() => {
              setDeletingBlockId(block.id);
              action(
                objToFormData({ blockId: block.id, modelId: block.modelId })
              );
            }}
            size={"icon"}
            variant={"ghost"}
            disabled={pending && deletingBlockId === block.id}
          >
            {pending && deletingBlockId === block.id ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </Button>
        ),
      }))}
    />
  );
}
