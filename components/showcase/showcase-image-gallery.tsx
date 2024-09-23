import { Showcase } from "@/lib/domains";
import GridImageGallery from "../image-grid-gallery";
import routes from "@/config/routes";

export default function ShowcaseImageGallery({
  showcase,
}: {
  showcase: Showcase;
}) {
  const images = showcase.showcaseImages.map((image) => ({
    src: routes.getFiles(image.fileId),
    width: image.width,
    height: image.height,
    alt: showcase.title,
  }));
  return images.length > 0 ? (
    <GridImageGallery images={images} rounded="rounded-md" columns={3} />
  ) : (
    <div className="text-sm text-muted-foreground h-28 flex justify-center items-center">
      No images
    </div>
  );
}
