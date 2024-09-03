import Container from "@/components/container";
import { modelUseCase } from "@/lib/usecases";
import { PathParamsSchema, SearchParamsSchema } from "./_lib.ts/schemas";
import Pagination from "@/components/public/pagination";
import ModelProfileCard from "@/components/public/model/model-card";
import { Metadata, ResolvingMetadata } from "next";

// Force full route cache and revalidate every 1 hour
export const dynamic = "auto";
export const revalidate = 3600;

type Props = {
  params: {
    categories?: string[];
  };
  searchParams: {
    page: number;
  };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Models${(params.categories || []).length > 0 ? ` | ${params.categories?.[0]}` : ""}${(params.categories || []).length > 1 ? ` | ${params.categories?.[1]}` : ""}`,
  };
}
export default async function Page({ params, searchParams }: Props) {
  const { page } = SearchParamsSchema.parse(searchParams);
  const {
    categories: { category, inTown, directBooking, local },
  } = PathParamsSchema.parse(params);
  const { data, totalPages, hasNext, hasPrev } =
    await modelUseCase.getModelProfiles({
      published: true,
      page,
      pageSize: 24,
      local,
      directBooking,
      ...(category ? { category: category } : {}),
      inTown,
    });

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
        {totalPages > 0 && (
          <Pagination
            path={`/models/${category}`}
            page={page}
            hasNext={hasNext}
            hasPrev={hasPrev}
            totalPages={totalPages}
          />
        )}
      </div>
    </Container>
  );
}
