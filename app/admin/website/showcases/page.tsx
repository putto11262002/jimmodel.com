import Container from "@/components/container";
import IconButton from "@/components/icon-button";
import MainDataViewLayout from "@/components/layouts/main-data-view-layout";
import Pagination from "@/components/pagination";
import Header, { HeaderBreadcrumb } from "@/components/shared/header";
import ShowcaseCreateDialog from "@/components/showcase/dialogs/showcase-create-dialog";
import GetShowcasesFilterForm from "@/components/showcase/forms/get-showcases-filter-form";
import ShowcaseTable from "@/components/showcase/tables/showcase-table";
import routes from "@/config/routes";
import { SearchParamsObj } from "@/lib/types/search-param";
import { GetShowcasesFilterSchema } from "@/lib/usecases";
import { validateSearchParamObj } from "@/lib/utils/search-param";
import { getShowcases } from "@/loaders/showcase";
import { PlusCircle } from "lucide-react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParamsObj>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchParamsVal = validateSearchParamObj(
    resolvedSearchParams,
    GetShowcasesFilterSchema
  );
  const getShowcasesFilter = searchParamsVal.ok ? searchParamsVal.data : {};
  const { data, page, pageSize, totalPages, hasNext, hasPrev } =
    await getShowcases(getShowcasesFilter);
  return (
    <>
      <Container max="liquid" className="grid gap-4">
        <MainDataViewLayout
          filter={<GetShowcasesFilterForm initialFilter={getShowcasesFilter} />}
          action={
            <div className="grid">
              <ShowcaseCreateDialog
                trigger={
                  <IconButton
                    size="sm"
                    icon={<PlusCircle className="icon-sm" />}
                    text="Showcase"
                  />
                }
              />
            </div>
          }
          dataView={<ShowcaseTable showcases={data} />}
          pagination={
            <Pagination
              currentFilter={getShowcasesFilter}
              pagination={{ page, pageSize, totalPages, hasNext, hasPrev }}
            />
          }
        />
      </Container>
    </>
  );
}
