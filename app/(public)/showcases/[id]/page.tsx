import Container from "@/components/container";
import SSRGridImageGallery from "@/components/image-grid-gallery/ssr";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { placeholderImage } from "@/config/image";
import routes from "@/config/routes";
import { NotFoundError } from "@/lib/errors/not-found-error";
import { showcaseUseCase } from "@/lib/usecases";
import Image from "next/image";
import Link from "next/link";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const showcase = await showcaseUseCase.getShowcaseById(id);
  if (showcase === null || !showcase?.published) {
    throw new NotFoundError("Showcase not found");
  }

  return (
    <>
      <section>
        <Container max="md">
          <h1 className="text-2xl font-bold text-center">{showcase.title}</h1>
          <h2 className="text-muted-foreground text-center">
            {showcase.description}
          </h2>
          <AspectRatio
            ratio={3 / 2}
            className="relative w-full rounded-md overflow-hidden mt-6"
          >
            <Image
              src={
                showcase.coverImage
                  ? routes.getFiles(showcase.coverImage?.id)
                  : placeholderImage
              }
              alt={showcase.title}
              fill
              className="object-cover"
            />
          </AspectRatio>
        </Container>
      </section>
      {showcase.models.length > 0 && (
        <section>
          <Container max="md" className="grid gap-4">
            <h2 className="text-lg font-medium">Talents</h2>
            <div className="flex items-center flex-wrap gap-4">
              {showcase.models.map((model, index) => (
                <Link href={`/models/profile/${model.id}`} key={index}>
                  <div className="w-[60px] h-[60px] relative overflow-hidden rounded-md">
                    <Image
                      src={
                        model.profileImage
                          ? routes.getFiles(model.profileImage.id)
                          : placeholderImage
                      }
                      fill
                      alt={model.name}
                      className="object-cover"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
      {showcase.images && showcase.images.length > 0 && (
        <section>
          <Container max="md" className="grid gap-4">
            <h2 className="text-lg font-medium">Images</h2>
            <div>
              <SSRGridImageGallery
                rounded={"rounded-md"}
                columns={3}
                images={showcase.images.map((image) => ({
                  src: routes.getFiles(image.fileId),
                  width: image.width,
                  height: image.height,
                  alt: showcase.title,
                }))}
              />
            </div>
          </Container>
        </section>
      )}
      {showcase.videoLinks && showcase.videoLinks.length && (
        <section>
          <Container max="md" className="grid gap-4">
            <h2 className="text-lg font-medium">Videos</h2>
            <div className="grid gap-4">
              {showcase.videoLinks.map((videoLink, index) => (
                <AspectRatio key={index} ratio={3 / 2}>
                  <iframe
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="w-full h-full"
                    src={videoLink}
                  />
                </AspectRatio>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
