import Container from "@/components/container";
import ShowcaseCard from "../_components/showcase-card";
import { showcaseUseCase } from "@/lib/usecases";
import { SearchParamsSchema } from "./_libs/schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Our Work",
  description: "Explore the stunning work that defines our legacy.",
};

export default async function Page({ searchParams }: { searchParams: {} }) {
  const { page: _page } = SearchParamsSchema.parse(searchParams);
  const { data, hasPrev, hasNext, totalPages, page } =
    await showcaseUseCase.getShowcases({
      page: _page,
      pageSize: 24,
      published: true,
    });

  function getSearchParams(searchParams: Record<string, string | string[]>) {
    const mutatbleSearchParams = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (!value || value === "") return;
      if (Array.isArray(value)) {
        value.forEach((v) => mutatbleSearchParams.append(key, v));
      } else {
        mutatbleSearchParams.set(key, value);
      }
    });
    return mutatbleSearchParams.toString();
  }

  return (
    <Container>
      <div className="grid md:grid-cols-3 gap-4">
        {data.map((showcase, index) => (
          <ShowcaseCard showcase={showcase} key={index} />
        ))}
      </div>
      {totalPages > 0 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          {hasPrev ? (
            <Link
              href={`/showcases?${getSearchParams({ ...searchParams, page: (page - 1).toString() })}`}
            >
              <Button variant={"outline"} size={"icon"}>
                <ChevronLeft className="w-4m h-4" />
              </Button>
            </Link>
          ) : (
            <Button disabled={true} variant={"outline"} size={"icon"}>
              <ChevronLeft className="w-4m h-4" />
            </Button>
          )}
          <p className="text-center text-sm font-medium">
            {page} of {totalPages}
          </p>

          {hasNext ? (
            <Link
              href={`/showcases?${getSearchParams({ ...searchParams, page: (page + 1).toString() })}`}
            >
              <Button variant={"outline"} size={"icon"}>
                <ChevronRight className="w-4m h-4" />
              </Button>
            </Link>
          ) : (
            <Button disabled={true} variant={"outline"} size={"icon"}>
              <ChevronRight className="w-4m h-4" />
            </Button>
          )}
        </div>
      )}
    </Container>
  );
}
