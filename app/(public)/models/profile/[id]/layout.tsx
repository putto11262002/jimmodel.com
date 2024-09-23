import Container from "@/components/container";
import { GridImageGalleryProvider } from "@/components/image-grid-gallery";
import OverviewSection from "./_components/overview-section";
import { NotFoundError } from "@/lib/errors/not-found-error";
import { Metadata, ResolvingMetadata } from "next";
import { omit } from "lodash";
import { getModelOrThrow, getPublishedModels } from "@/loaders/model";

export const revalidate = 86400;
//
// export async function generateMetadata(
//   { params }:
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const parentOpenGraph = (await parent).openGraph;
//   const model = await getModelOrThrow(params.id, { published: true });
//
//   if (!model) {
//     throw new NotFoundError("Model not found");
//   }
//
//   return {
//     title: `${model.name} - Model Profile`,
//     openGraph: {
//       ...(omit(parentOpenGraph, ["url"]) ?? {}),
//       title: `${model.name} - Model Profile`,
//     },
//   };
// }
//
//
//
export async function generateStaticParams() {
  let page = 1;
  let hasMore = true;
  const params: { id: string }[] = [];
  while (hasMore) {
    const models = await getPublishedModels({
      page: page,
      pageSize: 100,
    });

    models.data.forEach((model) => {
      params.push({ id: model.id });
    });

    hasMore = models.hasNext;
    page++;
  }
  return params;
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const model = await getModelOrThrow(id, { published: true });
  if (!model) {
    throw new NotFoundError("Model not found");
  }
  return (
    <GridImageGalleryProvider>
      <Container max="md">
        <OverviewSection model={model} />
        <div className="mt-4 md:mt-8">{children}</div>
      </Container>
    </GridImageGalleryProvider>
  );
}
