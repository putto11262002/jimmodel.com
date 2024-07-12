"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetModel } from "@/hooks/queries/model";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Header({ id }: { id: string }) {
  const { data, isSuccess } = useGetModel({ modelId: id });

  if (!isSuccess) {
    return <Skeleton className="h-10 w-[300px]" />;
  }
  return (
    <div className="flex items-center gap-6">
      <Link href={"/admin/models"}>
        <Button variant={"outline"} size={"icon"}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </Link>
      <h1 className="text-2xl font-semibold">{data.name}&apos;s Profile</h1>
    </div>
  );
}
