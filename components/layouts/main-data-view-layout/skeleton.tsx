import SidebarLayoutSkeleton from "@/components/layouts/sidebar-layout/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function MainDataViewLayoutSkeleton() {
  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-1/2">
          <h2 className="text-transparent text-2xl font-semibold">
            placeholder
          </h2>
        </Skeleton>
      </div>
      <SidebarLayoutSkeleton />
    </div>
  );
}
