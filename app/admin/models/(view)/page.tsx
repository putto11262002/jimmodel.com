"use client";
import { BreakcrumbSetter } from "@/components/breadcrumb";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserTable from "./_components/table";
import PaginationControl from "@/components/pagination-control";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/loader";
import { useGetModels } from "@/hooks/queries/model";
import useSession from "@/hooks/use-session";

export default function Page() {
  const session = useSession();

  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const q = searchParams.get("q") ?? undefined;

  const { data, isPending, isSuccess } = useGetModels({
    page,
    q,
    enabled: session.status === "authenticated",
  });

  if (isPending || !isSuccess) {
    return <Loader />;
  }

  return (
    <>
      <BreakcrumbSetter breadcrumbs={[{ label: "Models" }]} />
      <Card>
        <CardHeader>
          <CardTitle>Models</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable models={data.data} />
        </CardContent>
        <CardFooter>
          {data.totalPages > 1 && (
            <PaginationControl page={page} totalPages={data.totalPages} />
          )}
        </CardFooter>
      </Card>
    </>
  );
}
