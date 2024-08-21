"use client";
import Image from "next/image";
import { createContext, useContext, useState } from "react";
import {
  Gallery,
  Image as ImageType,
  ThumbnailImageProps,
} from "react-grid-gallery";
import Lightbox from "yet-another-react-lightbox";
import NextJsImage from "./lightbox-helper";
import "yet-another-react-lightbox/styles.css";
import {
  JSXElement,
  Photo,
  RenderImageContext,
  RenderImageProps,
  RowsPhotoAlbum,
  ColumnsPhotoAlbum,
} from "react-photo-album";
import "react-photo-album/columns.css";
import { cn } from "@/lib/utils";

type GridImageGalleryContext = {
  index: number;
  setIndex: (index: number) => void;
};

const gridImageGalleryContext = createContext<GridImageGalleryContext>({
  index: -1,
  setIndex: () => {},
});

export const useGridImageGalleryContext = () =>
  useContext(gridImageGalleryContext);

export const GridImageGalleryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [index, setIndex] = useState(-1);
  return (
    <gridImageGalleryContext.Provider value={{ index, setIndex }}>
      {children}
    </gridImageGalleryContext.Provider>
  );
};

export default function GridImageGallery({
  images,
  Overlay,
  rounded,
  columns,
  showLightBoxOnClick = false,
}: {
  rounded?: "rounded" | "rounded-md" | "rounded-lg";
  columns?: number;
  images: Photo[];
  Overlay?: ({ index }: { index: number }) => JSXElement;
  showLightBoxOnClick?: boolean;
}) {
  const { index, setIndex } = useGridImageGalleryContext();
  return (
    <>
      <Lightbox
        open={index >= 0}
        index={index}
        slides={images}
        close={() => setIndex(-1)}
        render={{ slide: NextJsImage }}
      />
      <ColumnsPhotoAlbum
        photos={images}
        columns={columns}
        onClick={(photo) => showLightBoxOnClick && setIndex(photo.index)}
        render={{
          image: (renderImageProps, renderImageCtx) =>
            ImageComp(
              renderImageProps,

              renderImageCtx,
              { rounded: rounded },
            ),
          ...(Overlay
            ? { extras: (_, context) => <Overlay index={context.index} /> }
            : {}),
        }}
      />
    </>
  );
}
function ImageComp(
  { alt = "", title, sizes }: RenderImageProps,
  { photo, width, height }: RenderImageContext,
  { rounded }: { rounded?: "rounded" | "rounded-md" | "rounded-lg" },
) {
  return (
    <div
      style={{
        width: `${width}px`,
        position: "relative",
        aspectRatio: `${width} / ${height}`,
      }}
      className={cn(rounded && rounded, rounded && "overflow-hidden")}
    >
      <Image
        fill
        src={photo}
        alt={alt}
        title={title}
        sizes={sizes}
        placeholder={"blurDataURL" in photo ? "blur" : undefined}
      />
    </div>
  );
}
