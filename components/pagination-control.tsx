"use client";
import { Button } from "@/components/ui/button";
import { setParam } from "@/lib/utils/search-param";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function PaginationControl({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const searchParams = useSearchParams();
  const path = usePathname();

  const router = useRouter();
  return (
    <div className="flex items-center  w-full">
      <div className="text-xs text-muted-foreground">
        Showing <strong>{page}</strong> of <strong>{totalPages}</strong> pages
      </div>
      <div className="ml-auto flex items-center space-x-3">
        <Button
          disabled={page <= 1}
          className="h-7 space-x-1"
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            setParam("page", [(page - 1).toString()], params);
            router.push(`${path}?${params}`);
          }}
        >
          <CircleChevronLeft className="h-3.5 w-3.5" />
          <span>Back</span>
        </Button>
        <Button
          disabled={page >= totalPages}
          className="h-7 space-x-1"
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            setParam("page", [(page + 1).toString()], params);
            router.push(`${path}?${params}`);
          }}
        >
          <span>Next</span>
          <CircleChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
