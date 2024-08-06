"use client";
import { useBreadcrumbSetter } from "@/components/breadcrumb";
import Container from "@/components/container";
import Loader from "@/components/loader";
import PaginationControl from "@/components/pagination-control";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import permissions from "@/config/permission";
import { useDeleteBlock, useGetModelBlocks } from "@/hooks/queries/model";
import useSession from "@/hooks/use-session";
import { formatUTCDateStringWithoutTZ } from "@/lib/utils/date";
import { ArrowRight, ChevronLeft, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const session = useSession(permissions.models.getModelBlocks);
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam) : 1;
  const { data, isSuccess } = useGetModelBlocks({
    modelId: id,
    page,
    enabled: session.status === "authenticated",
  });

  useBreadcrumbSetter([
    { label: "Models", href: "/admin/models" },
    { label: id, href: `/admin/models/${id}/update` },
    { label: "Blocks" },
  ]);

  const { mutate: deleteBlock } = useDeleteBlock();

  const router = useRouter();

  if (!isSuccess) {
    return <Loader />;
  }

  return (
    <Container className="grid gap-4">
      {/* <div className="flex gap-4 items-center"> */}
      {/*   <Button onClick={() => router.back()} variant={"outline"} size={"icon"}> */}
      {/*     <ChevronLeft className="w-4 h-4" /> */}
      {/*   </Button> */}
      {/*   <h2 className="text-2xl font-semibold">Blocks</h2> */}
      {/* </div> */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Start</TableHead>
                  <TableHead className="">End</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.length > 0 ? (
                  data.data.map((block, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {formatUTCDateStringWithoutTZ(block.start)}
                      </TableCell>
                      <TableCell>
                        {formatUTCDateStringWithoutTZ(block.end)}
                      </TableCell>
                      <TableCell>{block.reason}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => deleteBlock({ blockId: block.id })}
                          variant={"outline"}
                          size={"icon"}
                          className="w-7 h-7"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No blocks found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            {data.totalPages > 1 && (
              <PaginationControl
                page={data.page}
                totalPages={data.totalPages}
              />
            )}
          </CardFooter>
        </Card>
      </div>
    </Container>
  );
}
