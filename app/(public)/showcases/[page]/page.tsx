import Container from "@/components/container";
import ShowcaseCard from "../../_components/showcase-card";
import { GetShowcasesFilterSchema } from "@/lib/usecases";
import { getShowcases } from "@/loaders/showcase";
import { validateSearchParamObj } from "@/lib/utils/search-param";
import Pagination from "../../_components/pagination";
import routes from "@/config/routes";

export const metadata = {
  title: "Our Work",
  description: "Explore the stunning work that defines our legacy.",
};

const PAGE_SIZE = 24;

export async function generateStaticParams() {
  let hasMore = true;
  let page = 1;
  const params: { page: string }[] = [];
  while (hasMore) {
    const res = await getShowcases({
      pageSize: PAGE_SIZE,
      page,
      published: true,
    });
    params.push({ page: page.toString() });

    hasMore = res.hasNext;
    page++;
  }
  return params;
}

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: _page } = await params;
  const searchParamsValidation = validateSearchParamObj(
    { page: _page },
    GetShowcasesFilterSchema
  );
  const filter = searchParamsValidation.ok ? searchParamsValidation.data : {};
  const { data, hasPrev, hasNext, totalPages, page } = await getShowcases({
    page: filter.page,
    pageSize: PAGE_SIZE,
    published: true,
  });

  return (
    <Container className="">
      <div className="grid md:grid-cols-3 gap-4">
        {data.map((showcase, index) => (
          <ShowcaseCard showcase={showcase} key={index} />
        ))}
      </div>
      <Pagination
        totalPages={totalPages}
        next={hasNext ? routes.showcases.main(page + 1) : undefined}
        previous={hasPrev ? routes.showcases.main(page - 1) : undefined}
        page={page}
      />
    </Container>
  );
}
