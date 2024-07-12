"use client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { CardContent, CardFooter } from "@/components/ui/card";
import UserTable from "./table";
import PaginationControl from "@/components/pagination-control";
import client from "@/lib/api/client";
import { useSearchParams } from "next/navigation";
import TableSkeleton from "./_page-skeleton";
import PaginationControlSkeleton from "./pagination-control-skeleton";

export default function PageContent() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  const { data, isSuccess } = useQuery({
    queryKey: ["models", { page }],
    queryFn: async () => {
      const res = await client.api.models.profile.$get({
        query: { page: page.toString(), pageSize: (5).toString() },
      });
      console.log(res);
      const data = await res.json();
      return data;
    },
  });

  return (
    <>
      <CardContent>
        {!isSuccess ? <TableSkeleton /> : <UserTable models={data.data} />}
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
