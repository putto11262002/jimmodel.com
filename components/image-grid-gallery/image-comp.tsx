import { cn } from "@/lib/utils";
import Image from "next/image";
import { RenderImageContext, RenderImageProps } from "react-photo-album";

export default function ImageComp(
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
