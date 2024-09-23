import IconButton from "@/components/icon-button";
import GetBookingsFilterForm from "@/components/job/forms/get-bookings-filter-form";
import BookingTable from "@/components/job/tables/booking-table";
import Pagination from "@/components/pagination";
import { auth } from "@/config";
import permissions from "@/config/permission";
import { SearchParamsObj } from "@/lib/types/search-param";
import { GetBookingsFilterSchema } from "@/lib/usecases";
import { validateSearchParamObj } from "@/lib/utils/search-param";
import { getBookings } from "@/loaders/job";
import { PlusCircle, X } from "lucide-react";
import Link from "next/link";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParamsObj>;
}) {
  const resolvedSearchParams = await searchParams;
  const { id } = await params;
  await auth({ permission: permissions.jobs.getBookings });
  const searchParamsValidation = validateSearchParamObj(
    resolvedSearchParams,
    GetBookingsFilterSchema
  );
  const getBookingsFilter = searchParamsValidation.ok
    ? searchParamsValidation.data
    : {};
  const { data, page, pageSize, totalPages, hasPrev, hasNext } =
    await getBookings({ ...getBookingsFilter, jobIds: [id] });

  return (
    <div className="grid gap-4">
      <div className="grid lg:flex lg:items-center lg:justify-between gap-4">
        <GetBookingsFilterForm defaultFilter={getBookingsFilter} />
        <div className="">
          <Link href={`/admin/jobs/${id}/bookings/create`} className="grid">
            <IconButton
              size="sm"
              text="Booking"
              icon={<PlusCircle className="icon-sm" />}
            />
          </Link>
        </div>
      </div>
      <BookingTable
        select={{ start: true, end: true, type: true, delete: true }}
        bookings={data}
      />
      <Pagination
        currentFilter={getBookingsFilter}
        pagination={{ page, pageSize, totalPages, hasNext, hasPrev }}
      />
    </div>
  );
}
