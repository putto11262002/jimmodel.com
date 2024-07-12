import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

export default function ImageSkeleton() {
  return (
    <AspectRatio
      className="relative block group overflow-hidden rounded"
      ratio={1 / 1}
    >
      <Skeleton className="w-full h-full" />
    </AspectRatio>
  );
}
