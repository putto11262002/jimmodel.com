"use client";
import { ModelBlock } from "@/lib/domains";
import useSWR from "swr";
import { useRDateRange } from "../_components/date-context";
import ModelBlockTable from "@/components/model/blocks/model-block-table";
import { Skeleton } from "@/components/ui/skeleton";
import Alert from "@/components/alert";

export default function Default() {
  const { start, end, valid } = useRDateRange();
  const { data, isLoading, error } = useSWR(
    {
      url: "/api/model-blocks",
      start,
      end,
      valid,
    },
    (arg) => {
      if (!arg.valid) return [];
      return fetch(
        `${arg.url}?start=${start?.toISOString()}&end=${end?.toISOString()}`
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("failed to fetch");
          }
          return res.json();
        })
        .then((data) => data.data as ModelBlock[]);
    }
  );

  if (error) return <Alert variant="error">Failed to load blocks</Alert>;
  if (isLoading || !data) return <Skeleton className="h-6 w-full rounded-lg" />;

  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold">Conflicting Model Blocks</h2>
      <ModelBlockTable
        select={{ start: true, end: true, model: true }}
        blocks={data}
      />
    </div>
  );
}
