import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MetadataCardSkeleton() {
  return (
    <CardContent>
      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    </CardContent>
  );
}
