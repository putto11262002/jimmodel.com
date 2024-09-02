import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { modelUseCase } from "@/lib/usecases";
import { Filter } from "lucide-react";
import ModelFilterDialog from "./_components/model-filter-dialog";
import { PathParamsSchema, SearchParamsSchema } from "./_lib.ts/schemas";
import Pagination from "@/components/public/pagination";
import ModelProfileCard from "@/components/public/model/model-card";
import { Metadata, ResolvingMetadata } from "next";

// Force full route cache and revalidate every 1 hour
export const dynamic = "auto";
export const revalidate = 3600;

type Props = {
  params: {
    category: string;
  };
  searchParams: {
    page: number;

    local: string;
    directBooking: string;
    inTown: string;
  };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Models - ${params.category}`,
  };
}
export default async function Page({ params, searchParams }: Props) {
  const { page, local, directBooking, inTown } =
    SearchParamsSchema.parse(searchParams);
  const { category } = PathParamsSchema.parse(params);
  const { data, totalPages, hasNext, hasPrev } =
    await modelUseCase.getModelProfiles({
      published: true,
      page,
      pageSize: 24,
      local:
        local === "local" ? true : local === "non-local" ? false : undefined,
      directBooking:
        directBooking === "direct booking"
          ? true
          : directBooking === "non-direct booking"
            ? false
            : undefined,
      ...(category ? { category: category } : {}),
      inTown:
        inTown === "in town" ? true : inTown === "out town" ? false : undefined,
    });

  return (
    <Container>
      <div className="flex">
        <ModelFilterDialog>
          <Button className="ml-auto h-7" variant={"outline"} size={"sm"}>
            <Filter className="w-3.5 h-3.5 mr-2" />
            Filters
          </Button>
        </ModelFilterDialog>
      </div>
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
