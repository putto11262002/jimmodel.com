import { Skeleton } from "@/components/ui/skeleton";

export default function PaginationControlSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-12" />
      <Skeleton className="h-6 w-12" />
    </div>
  );
}
