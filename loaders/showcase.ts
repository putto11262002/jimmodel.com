import { showcaseUseCase } from "@/config";
import { Showcase } from "@/lib/domains";
import { GetShowcasesFilter } from "@/lib/usecases/showcase";
import { notFound } from "next/navigation";
import { cache } from "react";

export const getShowcases = cache(async (filter: GetShowcasesFilter) =>
  showcaseUseCase.getShowcases(filter)
);

export const getShowcaseOrThrow = cache(async (id: string) => {
  const showcase = await showcaseUseCase.getShowcase(id);
  if (!showcase) {
    notFound();
  }
  return showcase;
});

export const canPublishShowcase = cache(async (showcase: Showcase) => {
  return showcaseUseCase.canPublishShowcase(showcase);
});
