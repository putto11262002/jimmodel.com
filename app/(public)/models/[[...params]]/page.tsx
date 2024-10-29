import Container from "@/components/container";
import ModelProfileCard from "@/components/public/model/model-card";
import { GetModelsFilterSchema } from "@/lib/usecases";
import { getModels, getPublishedModels } from "@/loaders/model";
import { BOOKING_STATUSES, MODEL_CATEGORIES } from "@/db/constants";
import { stringToIntOrUndefined } from "@/lib/utils/text";
import { Model } from "@/lib/domains";
import Pagination from "../../_components/pagination";
import routes from "@/config/routes";
import { Metadata, ResolvedMetadata } from "next";

// Every day
export const revalidate = 86400;
export const dynamicParams = true;

type Props = {
  params: Promise<{
    params?: string[];
  }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvedMetadata
): Promise<Metadata> {
  const resovledParams = await params;

  const rawCategory = resovledParams.params?.[0];
  const category =
    rawCategory === "all"
      ? undefined
      : rawCategory
      ? decodeURIComponent(rawCategory)
      : undefined;

  const rawBookingStatus = resovledParams.params?.[1];

  const bookingStatus =
    rawBookingStatus === "all"
      ? undefined
      : rawBookingStatus
      ? decodeURIComponent(rawBookingStatus)
      : undefined;
  return {
    title: `Models${category ? ` | ${category}` : " | All"}${
      bookingStatus ? ` ${bookingStatus}` : ""
    }`,
    description: "Explore our models",
  };
}
const PAGE_SIZE = 24;

export async function generateStaticParams() {
  const params: { params: string[] }[] = [{ params: [] }];
  for (const category of [...MODEL_CATEGORIES, "all"]) {
    for (const bookingStatus of [...BOOKING_STATUSES, "all"]) {
      let hasMore = true;
      let page = 1;
      while (hasMore) {
        hasMore = await getModels({
          page,
          pageSize: PAGE_SIZE,
          category:
            category === "all" ? undefined : (category as Model["category"]),
          bookingStatus:
            bookingStatus === "all"
              ? undefined
              : (bookingStatus as Model["bookingStatus"]),
          published: true,
        }).then((result) => result.hasNext);
        params.push({ params: [category, bookingStatus, page.toString()] });
        page++;
      }
    }
  }
  return params;
}

export default async function Page({ params }: Props) {
  const resovledParams = await params;

  const rawCategory = resovledParams.params?.[0];
  const category =
    rawCategory === "all"
      ? undefined
      : rawCategory
      ? decodeURIComponent(rawCategory)
      : undefined;

  const rawBookingStatus = resovledParams.params?.[1];

  const bookingStatus =
    rawBookingStatus === "all"
      ? undefined
      : rawBookingStatus
      ? decodeURIComponent(rawBookingStatus)
      : undefined;

  const _pageStr = resovledParams.params?.[2];
  const _page = _pageStr ? stringToIntOrUndefined(_pageStr) : undefined;

  const filter = GetModelsFilterSchema.parse({
    page: _page,
    category: category,
    bookingStatus: bookingStatus,
  });

  const { data, totalPages, hasNext, hasPrev, page } = await getPublishedModels(
    {
      published: true,
      page: filter.page,
      pageSize: PAGE_SIZE,
      bookingStatus: filter.bookingStatus,
      category: filter.category,
      compact: true,
    }
  );

  return (
    <Container>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        {data.length > 0 ? (
          data.map((profile, index) => (
            <ModelProfileCard profile={profile} key={index} />
          ))
        ) : (
          <div className="col-span-full py-4 flex items-center justify-center text-center text-muted-foreground text-sm">
            No Model listed
          </div>
        )}
      </div>
      <div className="mt-6">
        <Pagination
          totalPages={totalPages}
          next={
            hasNext
              ? routes.models.main(
                  filter.category ?? "all",
                  filter.bookingStatus ?? "all",
                  page + 1
                )
              : undefined
          }
          previous={
            hasPrev
              ? routes.models.main(
                  filter.category ?? "all",
                  filter.bookingStatus ?? "all",
                  page - 1
                )
              : undefined
          }
          page={page}
        />
      </div>
    </Container>
  );
}
