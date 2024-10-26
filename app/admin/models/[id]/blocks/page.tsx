import Container from "@/components/container";
import DateRangePicker from "@/components/form/server-action/date-range-picker";
import IconButton from "@/components/icon-button";
import MainDataViewLayout from "@/components/layouts/main-data-view-layout";
import ModelBlockTable from "@/components/model/blocks/model-block-table";
import ModelBlockCreateDialog from "@/components/model/dialogs/model-block-create-dialog";
import GetModelBlocksFilterForm from "@/components/model/forms/get-model-blocks-filter-form";
import Pagination from "@/components/pagination";
import AutoForm, { AutoFormPendingIcon } from "@/components/shared/auto-form";
import { Button } from "@/components/ui/button";
import { auth } from "@/config";
import permissions from "@/config/permission";
import { SearchParamsObj } from "@/lib/types/search-param";
import { GetModelBlocksFilterSchema } from "@/lib/usecases/model/inputs";
import { validateSearchParamObj } from "@/lib/utils/search-param";
import { getModelBlocks } from "@/loaders/model";
import { PlusCircle } from "lucide-react";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParamsObj>;
}) {
  const resolvedSearchParams = await searchParams;
  const { id } = await params;
  await auth({ permission: permissions.models.getBlocks });
  const searchParamsValidation = validateSearchParamObj(
    resolvedSearchParams,
    GetModelBlocksFilterSchema
  );
  const getModelBlocksFilter = searchParamsValidation.ok
    ? searchParamsValidation.data
    : {};
  const { data, page, totalPages, hasNext, hasPrev, pageSize } =
    await getModelBlocks({
      ...getModelBlocksFilter,
      pageSize: 10,
      modelIds: [id],
    });

  return (
    <MainDataViewLayout
      filter={<GetModelBlocksFilterForm defaultFilter={getModelBlocksFilter} />}
      action={
        <ModelBlockCreateDialog
          trigger={
            <IconButton
              icon={<PlusCircle className="icon-sm" />}
              text="Block"
              size="sm"
            />
          }
          id={id}
        />
      }
      dataView={<ModelBlockTable blocks={data} />}
      pagination={
        <Pagination
          currentFilter={getModelBlocksFilter}
          pagination={{ page, pageSize, totalPages, hasNext, hasPrev }}
        />
      }
    />
  );
}
