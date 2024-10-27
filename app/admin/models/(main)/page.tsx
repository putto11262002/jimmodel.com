import Avatar from "@/components/avatar";
import Container from "@/components/container";
import DataTable from "@/components/data-table";
import MainDataViewLayout from "@/components/layouts/main-data-view-layout";
import ModelCreateDialog from "@/components/model/dialogs/model-create-dialog";
import GetModelsFilterForm from "@/components/model/forms/get-models-filter-form";
import ModelDropdownMenu from "@/components/model/model-dropdown-menu";
import Pagination from "@/components/pagination";
import Header, { HeaderBreadcrumb } from "@/components/shared/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/config";
import permissions from "@/config/permission";
import routes from "@/config/routes";
import {
  BOOKING_STATUS_LABELS,
  GENDER_LABELS,
  MODEL_CATEGORY_LABELS,
} from "@/db/constants";
import { SearchParamsObj } from "@/lib/types/search-param";
import { GetModelsFilterSchema } from "@/lib/usecases";
import { validateSearchParamObj } from "@/lib/utils/search-param";
import { getModels } from "@/loaders/model";
import { CalendarX, Edit, MoreHorizontal, PlusCircle } from "lucide-react";
import Link from "next/link";

const breadcrumb: HeaderBreadcrumb[] = [
  {
    label: "Admin",
    href: routes.admin.main,
  },
  {
    label: "Models",
    href: routes.admin.models.main,
  },
];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParamsObj>;
}) {
  const resolvedSearchParams = await searchParams;
  await auth({ permission: permissions.models.getModels });
  const searchParamsValidation = validateSearchParamObj(
    resolvedSearchParams,
    GetModelsFilterSchema
  );
  const getModelsFilter = searchParamsValidation.ok
    ? searchParamsValidation.data
    : {};
  const { data, page, totalPages, hasNext, hasPrev, pageSize } =
    await getModels({ ...getModelsFilter, pageSize: 10 });
  return (
    <>
      <Header breadcrumb={breadcrumb}>
        {/* <h1 className="text-lg font-semibold">All Models</h1> */}
      </Header>
      <Container className="grid gap-4" max="liquid">
        <MainDataViewLayout
          filter={<GetModelsFilterForm initialFilter={getModelsFilter} />}
          action={
            <ModelCreateDialog
              trigger={
                <Button size={"sm"}>
                  <PlusCircle className="w-3.5 h-3.5 mr-2" />
                  <span>Model</span>
                </Button>
              }
            />
          }
          dataView={
            <DataTable
              border
              shadow
              rounded
              columns={
                [
                  {
                    key: "avatar",
                    header: "Profile",
                  },
                  {
                    key: "name",
                    header: "Name",
                  },
                  { key: "gender", header: "Gender", display: "md" },
                  { key: "category", header: "Category", display: "md" },
                  {
                    key: "bookingStatus",
                    header: "Booking Status",
                    display: "md",
                  },
                  { key: "published", header: "Published", display: "md" },
                  { key: "action", hideHeader: true, align: "right" },
                ] as const
              }
              data={data.map((model) => ({
                avatar: (
                  <Avatar
                    size="sm"
                    fileId={model.profileImageId}
                    name={model.name}
                  />
                ),
                name: model.name,
                gender: GENDER_LABELS[model.gender],
                category: (
                  <Badge variant="outline">
                    {MODEL_CATEGORY_LABELS[model.category]}
                  </Badge>
                ),
                bookingStatus: (
                  <Badge variant="outline">
                    {BOOKING_STATUS_LABELS[model.bookingStatus]}
                  </Badge>
                ),
                published: (
                  <Badge variant={model.published ? "success" : "warning"}>
                    {model.published ? "Yes" : "No"}
                  </Badge>
                ),
                action: (
                  <ModelDropdownMenu
                    model={model}
                    trigger={
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal className="icon-sm" />
                      </Button>
                    }
                  />
                ),
              }))}
            />
          }
          pagination={
            <Pagination
              pagination={{ page, pageSize, totalPages, hasNext, hasPrev }}
              currentFilter={getModelsFilter}
            />
          }
        />
      </Container>
    </>
  );
}
