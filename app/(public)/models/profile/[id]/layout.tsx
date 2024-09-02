import Container from "@/components/container";
import { GridImageGalleryProvider } from "@/components/image-grid-gallery";
import OverviewSection from "./_components/overview-section";
import { modelUseCase } from "@/lib/usecases";
import { NotFoundError } from "@/lib/errors/not-found-error";
import { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";
import { omit } from "lodash";

const getModel = cache(async (id: string) => {
  return modelUseCase.getById(id);
});

export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parentOpenGraph = (await parent).openGraph;
  const model = await getModel(params.id);

  if (!model) {
    throw new NotFoundError("Model not found");
  }

  return {
    title: `${model.name} - Model Profile`,
    openGraph: {
      ...(omit(parentOpenGraph, ["url"]) ?? {}),
      title: `${model.name} - Model Profile`,
    },
  };
}

export default async function Layout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const model = await getModel(id);
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
