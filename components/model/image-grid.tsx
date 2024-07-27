import { ModelImage } from "@/lib/types/model";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
export default function ImageGrid<T extends { fileId: string }>({
  images,
  Overlay,
}: {
  images: T[];
  Overlay?: React.FC<{ image: T }>;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image, index) => (
        <AspectRatio
          key={index}
          className="relative block group overflow-hidden rounded"
          ratio={1 / 1}
        >
          <div className="absolute hidden group-hover:flex w-full h-full z-10 inset-0 ">
            {Overlay && <Overlay image={image} />}
          </div>
          <Image
            className="object-cover w-full h-full"
            src={`/files/${image.fileId}`}
            alt={"Model"}
            fill
          />
        </AspectRatio>
      ))}
    </div>
  );
}
