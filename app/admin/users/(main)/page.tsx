import DataTable from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { upperFirst } from "lodash";
import { Button, buttonVariants } from "@/components/ui/button";
import { Edit, PlusCircle } from "lucide-react";
import Container from "@/components/container";
import Link from "next/link";
import IconButton from "@/components/icon-button";
import { getUsers } from "@/loaders";
import Avatar from "@/components/avatar";
import GetUsereFilterForm from "@/components/user/forms/get-users-filter-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTriggerWithoutIcon,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import Pagination from "@/components/pagination";
import { SearchParamsObj } from "@/lib/types/search-param";
import { validateSearchParamObj } from "@/lib/utils/search-param";
import { GetUsersFilterSchema } from "@/lib/usecases";
import { USER_ROLE_LABELS } from "@/db/constants";
import Header, { HeaderBreadcrumb } from "@/components/shared/header";
import routes from "@/config/routes";

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
        <div className="grid lg:flex lg:items-end lg:justify-between gap-4">
          <div className="hidden lg:block">
            <GetUsereFilterForm initialFilter={getUsersFilter} />
          </div>
          <Accordion
            collapsible
            type="single"
            className="w-full block lg:hidden border-b-0"
          >
            <AccordionItem value="filters" className="border-b-0">
              <AccordionTriggerWithoutIcon
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "w-full"
                )}
              >
                Filters
              </AccordionTriggerWithoutIcon>
              <AccordionContent className="py-4">
                <GetUsereFilterForm initialFilter={getUsersFilter} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Link className="grid" href="/admin/users/create">
            <IconButton
              size={"sm"}
              icon={<PlusCircle className="w-4 h-4" />}
              text="User"
            />
          </Link>
        </div>
        <DataTable
          border
          rounded
          shadow
          columns={
            [
              {
                key: "avatar",
                hideHeader: true,
              },
              {
                key: "name",
                header: "Name",
              },
              {
                key: "username",
                header: "Username",
              },
              {
                key: "roles",
                header: "Roles",
              },
              {
                key: "action",
                hideHeader: true,
                align: "right",
              },
            ] as const
          }
          data={data.map((user) => ({
            avatar: <Avatar size="sm" fileId={user.imageId} name={user.name} />,
            name: user.name,
            username: user.username,
            roles: (
              <div className="flex items-center gap-1">
                {user.roles.map((role, index) => (
                  <Badge variant={"outline"} key={index}>
                    {USER_ROLE_LABELS[role]}
                  </Badge>
                ))}
              </div>
            ),
            action: (
              <Link
                href={routes.admin.users["[id]"].edit.password({ id: user.id })}
              >
                <Button size={"icon"} variant={"ghost"}>
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
            ),
          }))}
        />

        <Pagination
          currentFilter={getUsersFilter}
          pagination={{ page, pageSize, totalPages, hasPrev, hasNext }}
        />
      </Container>
    </>
  );
}
