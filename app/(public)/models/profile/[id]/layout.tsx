import Container from "@/components/container";
import { GridImageGalleryProvider } from "@/components/image-grid-gallery";
import OverviewSection from "./_components/overview-section";
import { modelUseCase } from "@/lib/usecases";
import { NotFoundError } from "@/lib/errors/not-found-error";

export default async function Layout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const model = await modelUseCase.getById(id);
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
