"use client";
import Container from "@/components/container";
import CreateWebAssetDialog from "./_components/create-web-asset-dialog";
import { z } from "zod";
import { stringToNumberOrError } from "@/lib/validators/req-query";
import Loader from "@/components/loader";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WebAssetTable from "./_components/web-asset-table";
import PaginationControl from "@/components/pagination-control";
import { useRouter } from "next/navigation";
import {
  useDeleteWebAsset,
  useGetWebAssets,
  usePublishWebAsset,
  useUnPublishWebAsset,
} from "@/hooks/queries/web-asset";
import useSession from "@/hooks/use-session";
import permissions from "@/config/permission";
import { useBreadcrumbSetter } from "@/components/breadcrumb";
import FilterSection from "./_components/filter-section";

const QuerySchema = z.object({
  page: stringToNumberOrError.optional().default(1),
});

export default function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const session = useSession(permissions.weebAssets.getWebAssets);
  const { page } = QuerySchema.parse(searchParams);
  const router = useRouter();
  const { data, isSuccess } = useGetWebAssets({
    page,
    enabled: session.status === "authenticated",
  });
  const { mutate: publish } = usePublishWebAsset();
  const { mutate: unpublish } = useUnPublishWebAsset();
  const { mutate: remove } = useDeleteWebAsset();
  useBreadcrumbSetter([{ label: "Web Assets" }]);
  if (!isSuccess) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }
  return (
    <Container className="grid gap-4">
      <FilterSection />
      <Card>
        <CardHeader>
          <CardTitle>Web Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <WebAssetTable
            onPublish={(id) => publish({ id })}
            onUnpublish={(id) => unpublish({ id })}
            onUpdate={(id) => router.push(`/admin/web-assets/${id}/update`)}
            webAssets={data.data}
            onDelete={(id) => remove({ id })}
          />
        </CardContent>
        <CardFooter>
          <PaginationControl page={data.page} totalPages={data.totalPages} />
        </CardFooter>
      </Card>
    </Container>
  );
}
