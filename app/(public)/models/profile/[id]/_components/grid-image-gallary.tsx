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

export default function GridImageGallery({ images }: { images: ImageType[] }) {
  const { index, setIndex } = useGridImageGalleryContext();
  console.log(index);
  return (
    <div>
      <Lightbox
        open={index >= 0}
        index={index}
        slides={images}
        close={() => setIndex(-1)}
        render={{ slide: NextJsImage }}
      />
      <Gallery
        onClick={(index, item) => setIndex(index)}
        thumbnailImageComponent={ImageComp}
        images={images}
      />
    </div>
  );
}

function ImageComp({ imageProps }: ThumbnailImageProps) {
  return (
    <Image
      key={imageProps.key}
      style={{ ...imageProps.style }}
      src={imageProps.src}
      alt={imageProps.alt}
    />
  );
}
