import { PlusCircle } from "lucide-react";
import Container from "@/components/container";
import IconButton from "@/components/icon-button";
import { getUsers } from "@/loaders";
import GetUsereFilterForm from "@/components/user/forms/get-users-filter-form";
import Pagination from "@/components/pagination";
import { SearchParamsObj } from "@/lib/types/search-param";
import { validateSearchParamObj } from "@/lib/utils/search-param";
import { GetUsersFilterSchema } from "@/lib/usecases";
import Header, { HeaderBreadcrumb } from "@/components/shared/header";
import routes from "@/config/routes";
import MainDataViewLayout from "@/components/layouts/main-data-view-layout";
import UserCreateDialog from "@/components/user/user-create-dialog";
import UserTable from "@/components/user/tables/user-table";

const breadcrumb: HeaderBreadcrumb[] = [
  {
    label: "Admin",
    href: routes.admin.main,
  },
  {
    label: "Users",
    href: routes.admin.users.main,
  },
];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParamsObj>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchParamsValidaiton = validateSearchParamObj(
    resolvedSearchParams,
    GetUsersFilterSchema
  );
  const getUsersFilter = searchParamsValidaiton.ok
    ? searchParamsValidaiton.data
    : {};
  const { data, page, totalPages, hasNext, hasPrev, pageSize } = await getUsers(
    getUsersFilter
  );
  return (
    <>
      <Header breadcrumb={breadcrumb} />
      <Container max="liquid" className="grid gap-4">
        <MainDataViewLayout
          filter={<GetUsereFilterForm initialFilter={getUsersFilter} />}
          action={
            <UserCreateDialog
              trigger={
                <IconButton
                  size={"sm"}
                  icon={<PlusCircle className="w-4 h-4" />}
                  text="User"
                />
              }
            />
          }
          dataView={<UserTable users={data} />}
          pagination={
            <Pagination
              currentFilter={getUsersFilter}
              pagination={{ page, pageSize, totalPages, hasPrev, hasNext }}
            />
          }
        />
      </Container>
    </>
  );
}
