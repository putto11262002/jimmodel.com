import Container from "@/components/container";
import IconButton from "@/components/icon-button";
import JobCreateDialog from "@/components/job/dialogs/job-create-dialog";
import GetJobsFilterForm from "@/components/job/forms/get-jobs-filter-form";
import JobTable from "@/components/job/tables/job-table";
import MainDataViewLayout from "@/components/layouts/main-data-view-layout";
import Pagination from "@/components/pagination";
import Header, { HeaderBreadcrumb } from "@/components/shared/header";
import { auth } from "@/config";
import permissions from "@/config/permission";
import routes from "@/config/routes";
import { JOB_STATUS } from "@/db/constants";
import { SearchParamsObj } from "@/lib/types/search-param";
import { GetJobsFilterSchema } from "@/lib/usecases";
import { validateSearchParamObj } from "@/lib/utils/search-param";
import { getJobs } from "@/loaders/job";
import { PlusCircle } from "lucide-react";

const breadcrumb: HeaderBreadcrumb[] = [
  {
    label: "Admin",
    href: routes.admin.main,
  },
  {
    label: "Jobs",
    href: routes.admin.jobs.main,
  },
];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParamsObj>;
}) {
  await auth({ permission: permissions.jobs.getJobs });
  const resovledSearchParams = await searchParams;
  const searchParamsValidation = validateSearchParamObj(
    resovledSearchParams,
    GetJobsFilterSchema
  );
  const getJobsFilter = searchParamsValidation.ok
    ? searchParamsValidation.data
    : {};
  const { data, page, pageSize, totalPages, hasPrev, hasNext } = await getJobs({
    ...getJobsFilter,
    pageSize: 10,
  });

  return (
    <>
      <Header breadcrumb={breadcrumb}></Header>
      <Container max="liquid" className="grid gap-4">
        <MainDataViewLayout
          action={
            <div className="grid gap-2 lg:flex lg:items-centers">
              <JobCreateDialog
                status={JOB_STATUS.CONFIRMED}
                trigger={
                  <IconButton
                    size="sm"
                    icon={<PlusCircle className="icon-sm" />}
                    text="Job"
                  />
                }
              />

              <JobCreateDialog
                status={JOB_STATUS.PENDING}
                trigger={
                  <IconButton
                    size="sm"
                    icon={<PlusCircle className="icon-sm" />}
                    text="Option"
                  />
                }
              />
            </div>
          }
          filter={<GetJobsFilterForm initialFilter={getJobsFilter} />}
          dataView={<JobTable jobs={data} />}
          pagination={
            <Pagination
              pagination={{ page, pageSize, totalPages, hasPrev, hasNext }}
              currentFilter={getJobsFilter}
            />
          }
        />
      </Container>
    </>
  );
}
