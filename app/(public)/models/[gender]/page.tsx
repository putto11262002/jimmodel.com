import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { modelUseCase } from "@/lib/usecases";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import Image from "next/image";
import ModelFilterDialog from "./_components/model-filter-dialog";
import Link from "next/link";
import { PathParamsSchema, SearchParamsSchema } from "./_lib.ts/schemas";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Force full route cache and revalidate every 1 hour
export const dynamic = "auto";
export const revalidate = 3600;

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
            <Link href={`/models/profile/${profile.id}`} key={index}>
              <AspectRatio ratio={2 / 3}>
                <div
                  key={index}
                  className="relative rounded-md overflow-hidden group w-full h-full"
                >
                  <div className="text-center absolute inset-0 w-full h-full z-20 bg-black/50 text-white items-center justify-center group-hover:flex hidden flex-col">
                    <p className="font-bold">{profile.name}</p>
                    <div className="grid gap-2 mt-4">
                      <div>
                        <p className="text-xs">height</p>
                        <p>{profile.height || "-"}</p>
                      </div>

                      <div>
                        <p className="text-xs">weight</p>
                        <p>{profile.weight || "-"}</p>
                      </div>

                      {profile.gender !== "male" && (
                        <div>
                          <p className="text-xs">Bust</p>
                          <p>{profile.bust || "-"}</p>
                        </div>
                      )}

                      {profile.gender !== "female" && (
                        <div>
                          <p className="text-xs">Chest</p>
                          <p>{profile.chest || "-"}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs">Hips</p>
                        <p>{profile.hips || "-"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 w-full p-2 z-10 space-x-2 flex group-hover:hidden">
                    {profile.local && (
                      <Badge className="shadow-md bg-background text-foreground">
                        Local
                      </Badge>
                    )}
                    {!profile.local && profile.inTown && (
                      <Badge className="shadow-md bg-background text-foreground">
                        In Town
                      </Badge>
                    )}
                    {!profile.local &&
                      !profile.inTown &&
                      profile.directBooking && (
                        <Badge className="shadow-md bg-background text-foreground">
                          Direct Booking
                        </Badge>
                      )}
                  </div>
                  {profile.profileImage ? (
                    <Image
                      src={`/files/${profile.profileImage.id}`}
                      alt={profile.name}
                      fill
                      className="object-cover pointer-events-none"
                      sizes="30vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-muted  text-2xl font-semibold">
                      {profile.name}
                    </div>
                  )}
                </div>
              </AspectRatio>
            </Link>
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
