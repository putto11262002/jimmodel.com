import Container from "@/components/container";
import GetJobsFilterForm from "@/components/job/forms/get-jobs-filter-form";
import JobTable from "@/components/job/tables/job-table";
import MainDataViewLayout from "@/components/layouts/main-data-view-layout";
import Pagination from "@/components/pagination";
import { auth } from "@/config";
import permissions from "@/config/permission";
import { SearchParamsObj } from "@/lib/types/search-param";
import { GetJobsFilterSchema } from "@/lib/usecases";
import { validateSearchParamObj } from "@/lib/utils/search-param";
import { getJobs } from "@/loaders/job";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParamsObj>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  await auth({ permission: permissions.jobs.getJobs });
  const searchParamsValidation = validateSearchParamObj(
    resolvedSearchParams,
    GetJobsFilterSchema
  );
  const getJobsFilter = searchParamsValidation.ok
    ? searchParamsValidation.data
    : {};

  const { data, ...pagination } = await getJobs({
    ...getJobsFilter,
    ownerIds: [id],
    pageSize: 10,
  });

  return (
    <Container max="xl">
      <MainDataViewLayout
        filter={
          <GetJobsFilterForm
            select={{ q: true, status: true }}
            initialFilter={getJobsFilter}
          />
        }
        dataView={<JobTable jobs={data} />}
        pagination={
          <Pagination pagination={pagination} currentFilter={getJobsFilter} />
        }
      />
    </Container>
  );
}
