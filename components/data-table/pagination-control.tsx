"use client";
import { Pagination } from "@/lib/types/paginated-data";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Size = "md" | "sm";

export type PaginationProps = Pagination & {
  size?: "md" | "sm";
  onPageChange?: (page: number) => void;
  hideWhenSinglePage?: boolean;
};

function getButtonSizeClass(size: Size): string {
  if (size === "sm") {
    return "w-7 h-7";
  }
  return "";
}

function getIconSizeClass(size: Size): string {
  if (size === "sm") {
    return "h-3.5 w-3.5";
  }
  return "w-4 h-4";
}

export default function PaginationControl({
  hasNext,
  hasPrev,
  totalPages,
  page,
  size = "md",
  hideWhenSinglePage = true,
  onPageChange,
}: PaginationProps) {
  if (hideWhenSinglePage && totalPages < 2) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        className={cn(getButtonSizeClass(size))}
        variant={"outline"}
        size={"icon"}
        disabled={!hasPrev}
        onClick={() => onPageChange && hasPrev && onPageChange(page - 1)}
      >
        <ChevronLeft className={cn(getIconSizeClass(size))} />
      </Button>
      <p
        className={cn(
          "text-center text-sm font-medium",
          size === "sm" && "text-xs",
        )}
      >
        {page} of {totalPages}
      </p>

      <Button
        disabled={!hasNext}
        className={cn(getButtonSizeClass(size))}
        variant={"outline"}
        size={"icon"}
        onClick={() => onPageChange && hasNext && onPageChange(page + 1)}
      >
        <ChevronRight className={cn(getIconSizeClass(size))} />
      </Button>
    </div>
  );
}
