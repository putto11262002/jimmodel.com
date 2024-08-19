import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { modelUseCase } from "@/lib/usecases";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import Image from "next/image";
import ModelFilterDialog from "./_components/model-filter-dialog";
import Link from "next/link";
import { PathParamsSchema, SearchParamsSchema } from "./_lib.ts/schemas";

export default async function Page({
  params,
  searchParams,
}: {
  params: {
    gender: string;
    local: string;
    directBooking: string;
    inTown: string;
  };
  searchParams: { page: number };
}) {
  const { page, local, directBooking, inTown } =
    SearchParamsSchema.parse(searchParams);
  const { gender } = PathParamsSchema.parse(params);
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
      ...(gender ? { genders: [gender] } : {}),
      inTown:
        inTown === "in town" ? true : inTown === "out town" ? false : undefined,
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
            <div
              key={index}
              className="relative h-[18em] md:h-[22em] rounded-md overflow-hidden"
            >
              <div className="absolute bottom-0 w-full p-2 z-10 space-x-2">
                {/* {profile.inTown && ( */}
                {/*   <Badge className="bg-green-200 text-green-800 ">In Town</Badge> */}
                {/* )} */}
                {/* {profile.directBooking && ( */}
                {/*   <Badge className="bg-yellow-200 text-yellow-800"> */}
                {/*     Direct Booking */}
                {/*   </Badge> */}
                {/* )} */}
              </div>
              {profile.image ? (
                <Image
                  src={`/files/${profile.image.fileId}`}
                  alt={profile.name}
                  fill
                  className="object-cover pointer-events-none"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-muted  text-2xl font-semibold">
                  {profile.name}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full py-4 flex items-center justify-center text-center text-muted-foreground text-sm">
            No Model listed
          </div>
        )}
      </div>
      {totalPages > 0 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          {hasPrev ? (
            <Link
              href={`/models/${gender}?${getSearchParams({ ...searchParams, page: (page - 1).toString() })}`}
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
              href={`/models/${gender}?${getSearchParams({ ...searchParams, page: (page + 1).toString() })}`}
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
