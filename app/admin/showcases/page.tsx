"use client";
import Container from "@/components/container";
import CreateShowcaseDialog from "./_components/create-showcase-dialog";
import { Button } from "@/components/ui/button";
import { Plus, PlusCircle } from "lucide-react";
import ShowcaseTable from "./_components/showcase-table";
import { useGetShowcases } from "@/hooks/queries/showcase";
import Loader from "@/components/loader";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PaginationControl from "@/components/pagination-control";
import { z } from "zod";
import { stringToNumberOrError } from "@/lib/validators/req-query";
import useSession from "@/hooks/use-session";
import permissions from "@/config/permission";
const QuerySchema = z.object({
  page: stringToNumberOrError.optional().default(1),
});
export default function Page({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const session = useSession(permissions.showcases.getShowcases);
  const { page } = QuerySchema.parse({ page: searchParams.page });
  const { data, isSuccess } = useGetShowcases({
    enabled: session.status === "authenticated",
    page,
  });
  if (!isSuccess) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }
  return (
    <Container className="grid gap-4">
      <div>
        <CreateShowcaseDialog>
          <Button className="h-7" size={"sm"}>
            <PlusCircle className="h-3.5 w-3.5 stroke-3" />{" "}
            <span className="ml-2 hidden md:inline">Showcase</span>
          </Button>
        </CreateShowcaseDialog>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Showcases</CardTitle>
          </CardHeader>
          <CardContent>
            <ShowcaseTable showcases={data.data} />
          </CardContent>
          <CardFooter>
            <PaginationControl totalPages={data.totalPages} page={page} />
          </CardFooter>
        </Card>
      </div>
    </Container>
  );
}
