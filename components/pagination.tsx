import { ChevronLeft, ChevronRight } from "lucide-react";
import SearchParamsForm, {
  SearchParamsFormProps,
} from "./shared/search-params-form";
import { Button } from "./ui/button";
import { Pagination as _Pagination } from "@/lib/types/paginated-data";

export default function Pagination({
  currentFilter,
  pagination,
  path,
}: {
  currentFilter: SearchParamsFormProps["obj"];
  pagination: _Pagination;
  path?: SearchParamsFormProps["path"];
}) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <SearchParamsForm
        button={
          <Button
            size={"icon"}
            variant={"outline"}
            disabled={!pagination.hasPrev}
            type="submit"
          >
            <ChevronLeft className="icon-sm" />
          </Button>
        }
        obj={{
          ...currentFilter,
          page: pagination.page - (pagination.hasPrev ? 1 : 0),
        }}
        path={path}
      />
      <p className="text-sm">
        {pagination.page} of {pagination.totalPages}
      </p>
      <SearchParamsForm
        button={
          <Button
            variant={"outline"}
            size={"icon"}
            disabled={!pagination.hasNext}
            type="submit"
          >
            <ChevronRight className="icon-sm" />
          </Button>
        }
        obj={{
          ...currentFilter,
          page: pagination.page + (pagination.hasNext ? 1 : 0),
        }}
        path={path}
      />
    </div>
  );
}
