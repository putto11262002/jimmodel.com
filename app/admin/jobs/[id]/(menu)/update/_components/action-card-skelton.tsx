import { Skeleton } from "@/components/ui/skeleton";

export default function ActionCardSkeleton() {
  return (
    <div className="space-y-4 w-full">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
    </div>
  );
}
