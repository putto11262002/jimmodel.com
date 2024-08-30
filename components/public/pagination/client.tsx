"use client";
import { PaginatedData } from "@/lib/types/paginated-data";
import Link from "next/link";
import { Button } from "../../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { setParam } from "@/lib/utils/search-param";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export type PaginationProps = Omit<
  PaginatedData<unknown>,
  "data" | "pageSize"
> & {
  path: string;
  size?: "md" | "sm";
};

export default function _Pagination({
  hasNext,
  hasPrev,
  totalPages,
  page,
  path,
  size = "md",
}: PaginationProps) {
  const searchParams = useSearchParams();
  const getParams = (updatedPage: number) => {
    const mutatableSearchParams = new URLSearchParams(searchParams.toString());
    setParam("page", updatedPage.toString(), mutatableSearchParams);
    return mutatableSearchParams.toString();
  };
  return (
    <div className="flex items-center justify-center gap-4">
      {hasPrev ? (
        <Link href={`${path}?${getParams(page - 1)}`}>
          <Button
            className={cn(size === "sm" && "w-7 h-7 ")}
            variant={"outline"}
            size={"icon"}
          >
            <ChevronLeft
              className={cn("w-4 h-4", size === "sm" && "h-3.5 w-3.5")}
            />
          </Button>
        </Link>
      ) : (
        <Button disabled={true} variant={"outline"} size={"icon"}>
          <ChevronLeft
            className={cn("w-4 h-4", size === "sm" && "h-3.5 w-3.5")}
          />
        </Button>
      )}
      <p
        className={cn(
          "text-center text-sm font-medium",
          size === "sm" && "text-xs",
        )}
      >
        {page} of {totalPages}
      </p>

      {hasNext ? (
        <Link href={`${path}?${getParams(page + 1)}`}>
          <Button variant={"outline"} size={"icon"}>
            <ChevronRight
              className={cn("w-4 h-4", size === "sm" && "h-3.5 w-3.5")}
            />
          </Button>
        </Link>
      ) : (
        <Button disabled={true} variant={"outline"} size={"icon"}>
          <ChevronRight
            className={cn("w-4 h-4", size === "sm" && "h-3.5 w-3.5")}
          />
        </Button>
      )}
    </div>
  );
}
