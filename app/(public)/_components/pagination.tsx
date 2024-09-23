import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination as _Pagination } from "@/lib/types/paginated-data";
import Link from "next/link";

export default function Pagination({
  next,
  previous,
  totalPages,
  page,
}: {
  next: string | undefined;
  previous: string | undefined;
  totalPages: number;
  page: number;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <Link href={previous || ""}>
        <Button
          size={"icon"}
          variant={"outline"}
          disabled={!previous}
          type="submit"
        >
          <ChevronLeft className="icon-sm" />
        </Button>
      </Link>
      <p className="text-sm">
        {page} of {totalPages}
      </p>
      <Link href={next || ""}>
        <Button
          variant={"outline"}
          size={"icon"}
          disabled={!next}
          type="submit"
        >
          <ChevronRight className="icon-sm" />
        </Button>
      </Link>
    </div>
  );
}
