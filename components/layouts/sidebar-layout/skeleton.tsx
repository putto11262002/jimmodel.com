import { Skeleton } from "@/components/ui/skeleton";

export default async function SidebarLayoutSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="col-span-full md:col-span-1">
        <Skeleton className="w-full h-6" />
      </div>
      <div className="col-span-full md:col-span-4">
        <Skeleton className="w-full h-6" />
      </div>
    </div>
  );
}
