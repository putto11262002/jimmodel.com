"use client";
import { ApplicationImage } from "@/lib/domains";
import GridImageGallery from "../image-grid-gallery";
import { Badge } from "../ui/badge";
import routes from "@/config/routes";
import { APPLICATION_IMAGE_TYPE_LABELS } from "@/db/constants";

export default function ApplicationImageGallery({
  images,
}: {
  images: ApplicationImage[];
}) {
  const galleryImages = images.map((image) => ({
    src: routes.getFiles(image.fileId),
    width: image.width,
    height: image.height,
    type: image.type,
  }));
  return (
    <GridImageGallery
      rounded="rounded-md"
      columns={3}
      images={galleryImages}
      overlay={({ index }) => (
        <div className="top-2 right-2 absolute z-10">
          <Badge className="capitalize bg-background" variant="outline">
            {APPLICATION_IMAGE_TYPE_LABELS[images[index].type]}
          </Badge>
        </div>
      )}
    />
  );
}
