import GetApplicationsFilterForm from "@/components/application/forms/get-applications-filter-form";
import EditableApplicationTable from "@/components/application/tables/editable-application-table";
import Container from "@/components/container";
import MainDataViewLayout from "@/components/layouts/main-data-view-layout";
import Pagination from "@/components/pagination";
import Header, { HeaderBreadcrumb } from "@/components/shared/header";
import { auth } from "@/config";
import permissions from "@/config/permission";
import routes from "@/config/routes";
import { Application } from "@/lib/domains";
import { SearchParamsObj } from "@/lib/types/search-param";
import { GetApplicationsFilterSchema } from "@/lib/usecases";
import { validateSearchParamObj } from "@/lib/utils/search-param";
import { getApplications } from "@/loaders/application";

const breadcrumb: HeaderBreadcrumb[] = [
  {
    label: "Admin",
    href: routes.admin.main,
  },
  {
    label: "Applications",
    href: routes.admin.applications.main,
  },
];

const getMenuItems = ({ type }: { type: Application["status"] }) => [
  {
    label: "Submitted",
    href: `${routes.admin.applications.main}?status=submitted`,
    isActive: type === "submitted",
  },
  {
    label: "Approved",
    href: `${routes.admin.applications.main}?status=approved`,
    isActive: type === "approved",
  },
  {
    label: "Rejected",
    href: `${routes.admin.applications.main}?status=rejected`,
    isActive: type === "rejected",
  },
];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParamsObj>;
}) {
  const resolvedSearchParams = await searchParams;
  await auth({ permission: permissions.applications.getApplications });
  const searchParamsValidation = validateSearchParamObj(
    resolvedSearchParams,
    GetApplicationsFilterSchema
  );
  const getApplicationsFilter = searchParamsValidation.ok
    ? searchParamsValidation.data
    : {};
  const { data, page, pageSize, totalPages, hasPrev, hasNext } =
    await getApplications({
      ...getApplicationsFilter,
      status: getApplicationsFilter.status ?? "submitted",
    });
  return (
    <>
      <Header
        items={getMenuItems({
          type: getApplicationsFilter.status ?? "submitted",
        })}
        breadcrumb={breadcrumb}
      />
      <Container max="liquid" className="grid gap-4">
        <MainDataViewLayout
          action={<></>}
          filter={
            <GetApplicationsFilterForm initialFilter={getApplicationsFilter} />
          }
          dataView={
            <>
              <EditableApplicationTable applications={data} />
              <Pagination
                currentFilter={getApplicationsFilter}
                pagination={{ page, pageSize, totalPages, hasPrev, hasNext }}
              />
            </>
          }
        />
      </Container>
    </>
  );
}
