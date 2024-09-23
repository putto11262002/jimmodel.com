import Container from "@/components/container";
import IconButton from "@/components/icon-button";
import MainDataViewLayout from "@/components/layouts/main-data-view-layout";
import Pagination from "@/components/pagination";
import WebAssetCreateDialog from "@/components/web-asset/dialogs/web-asset-create-dialog";
import GetWebAssetsFilterForm from "@/components/web-asset/forms/get-web-assets-filter-form";
import EditableWebAssetTable from "@/components/web-asset/tables/editable-web-asset-table";
import { SearchParamsObj } from "@/lib/types/search-param";
import { GetWebAssetsFilterSchema } from "@/lib/usecases/web-asset/inputs/get-web-assets-filter";
import { validateSearchParamObj } from "@/lib/utils/search-param";
import { getWebAssets } from "@/loaders/web-asset";
import { CirclePlus } from "lucide-react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParamsObj>;
}) {
  const resolvedSearchParams = await searchParams;
  const result = validateSearchParamObj(
    resolvedSearchParams,
    GetWebAssetsFilterSchema
  );
  const getWebAssetsFilter = result.ok ? result.data : {};
  const { data, page, pageSize, totalPages, hasNext, hasPrev } =
    await getWebAssets(getWebAssetsFilter);
  return (
    <>
      <Container max="liquid" className="grid gap-4">
        <MainDataViewLayout
          filter={<GetWebAssetsFilterForm initialFilter={getWebAssetsFilter} />}
          action={
            <WebAssetCreateDialog
              trigger={
                <div className="grid">
                  <IconButton
                    size="sm"
                    icon={<CirclePlus className="icon-sm" />}
                    text="Web Asset"
                  />
                </div>
              }
            />
          }
          dataView={<EditableWebAssetTable webAssets={data} />}
          pagination={
            <Pagination
              currentFilter={getWebAssetsFilter}
              pagination={{ page, pageSize, totalPages, hasNext, hasPrev }}
            />
          }
        />
      </Container>
    </>
  );
}
