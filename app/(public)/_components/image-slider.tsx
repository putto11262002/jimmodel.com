"use client";
import routes from "@/config/routes";
import { WebAsset } from "@/lib/types/web-asset";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImageSlider({ images }: { images: WebAsset[] }) {
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      let updatedDirection: "left" | "right" = direction;
      if (index === 0) {
        setDirection("right");
        updatedDirection = "right";
      }

      if (index === images.length - 1) {
        setDirection("left");
        updatedDirection = "left";
      }

      if (updatedDirection === "right") {
        setIndex((prevIndex) => prevIndex + 1);
      } else {
        setIndex((prevIndex) => prevIndex - 1);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [setDirection, setIndex, direction, index]);

  return (
    <div className="overflow-hidden w-full h-full">
      <div
        className="flex items-center transition-transform duration-700 delay-100 ease-in-out w-full h-full"
        style={{
          transform: `translateX(-${index * 100}%)`,
        }}
      >
        {images.map((image, index) => (
          <div
            className={cn(
              "grow shrink-0 basis-full relative h-full overflow-hidden",
            )}
            key={index}
          >
            <Image
              priority={true}
              src={routes.getFiles(image.fileId)}
              alt={image.alt ?? image.tag}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
