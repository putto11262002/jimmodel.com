"use client";
import JobTable from "./_components/table";
import TableSkeleton from "./_components/skeleton-table";
import { CardContent, CardFooter } from "@/components/ui/card";
import PaginationControl from "@/components/pagination-control";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import client from "@/lib/api/client";

const PAGE_SIZE = 8;

import PaginationControlSkeleton from "../../models/(view)/pagination-control-skeleton";

export function PageContent() {
  // Use zod to validate and clean search params
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");

  const page = pageParam
    ? parseInt(Array.isArray(pageParam) ? pageParam?.[0] : pageParam, 10) || 1
    : 1;

  const { data, isSuccess } = useQuery({
    queryKey: ["jobs", { page }],
    queryFn: async () => {
      const res = await client.api.jobs.$get({
        query: { page: page.toString(), pageSize: PAGE_SIZE.toString() },
      });
      const data = await res.json();
      return data;
    },
  });

  return (
    <>
      <CardContent>
        {!isSuccess ? <TableSkeleton /> : <JobTable jobs={data.data} />}
      </CardContent>
      <CardFooter>
        {!isSuccess ? (
          <PaginationControlSkeleton />
        ) : (
          <PaginationControl page={page} totalPages={data.totalPages} />
        )}
      </CardFooter>
    </>
  );
}
