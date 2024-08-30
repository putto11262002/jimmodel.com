"use client";
import { ColumnsPhotoAlbum, Photo } from "react-photo-album";
import ImageComp from "./image-comp";
import "react-photo-album/columns.css";
export default function SSRGridImageGallery({
  images,
  rounded,
  columns,
}: {
  rounded?: "rounded" | "rounded-md" | "rounded-lg";
  columns?: number;
  images: Photo[];
}) {
  return (
    <ColumnsPhotoAlbum
      photos={images}
      columns={columns}
      render={{
        image: (renderImageProps, renderImageCtx) =>
          ImageComp(
            renderImageProps,

            renderImageCtx,
            { rounded: rounded },
          ),
      }}
    />
  );
}
