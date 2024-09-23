"use client";
import { Pagination } from "@/lib/types/paginated-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import PaginationControl from "./pagination-control";
import { Skeleton } from "../ui/skeleton";
import { cva } from "class-variance-authority";

const tableContainerCva = cva("space-y-4 overflow-hidden min-w-0", {
  variants: {
    rounded: {
      false: "",
      true: "rounded-md",
      md: "rounded-md",
      lg: "rounded-lg",
    },
    showdow: {
      false: "",
      true: "showdow",
      md: "showdow-md",
      lg: "showdow-lg",
    },
  },
  defaultVariants: {},
});

const cellCva = cva("first:pl-4 last:pr-4 whitespace-nowrap", {
  variants: {
    hidden: {
      false: "",
      true: "hidden",
      sm: "hidden sm:table-cell",
      md: "hidden md:table-cell",
      lg: "hidden lg:table-cell",
    },
    align: {
      center: "text-center",
      left: "text-left",
      right: "text-right",
    },
  },
  defaultVariants: {
    hidden: false,
    align: "right",
  },
});

type Column<T extends string> = {
  header?: string;
  /**
   * The key of the column in the data object
   */
  key: T;

  align?: "center" | "left" | "right";

  /**
   * Only display column when the screen exceeds the breakpoint. If not provided the column is displayed
   */
  display?: "sm" | "md" | "lg";

  whiteSpace?: "normal" | "nowrap" | "wrap";

  hideHeader?: boolean;
};

type TableData<T extends readonly Column<string>[]> = Record<
  ColumnKey<T>,
  string | React.ReactNode
>[];

type ColumnKey<T extends readonly Column<string>[]> = T[number]["key"];

type BaseProps<T extends readonly Column<string>[]> = {
  columns: T;
  data?: TableData<T>;
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  emptyText?: string | React.ReactNode;
  border?: boolean;
  shadow?: boolean;
  rounded?: boolean;
};

type Props<T extends readonly Column<string>[]> = BaseProps<T>;
export default function DataTable<T extends readonly Column<string>[]>(
  props: Props<T>
) {
  return (
    <div
      className={cn(
        "space-y-4 overflow-hidden min-w-0 bg-background",
        props.border ? "border" : "",
        props.shadow ? "shadow" : "",
        props.rounded ? "rounded-lg" : ""
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="">
            {props.columns.map((column, index) => (
              <TableHead
                className={cn(
                  getDisplayClass(column.display),
                  "first:pl-4 last:pr-4",
                  "whitespace-nowrap"
                )}
                align={column.align}
                key={index}
              >
                <span className={cn(column.hideHeader && "sr-only")}>
                  {column.header || column.key}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {!props.data ? (
            <LoadingTableContent />
          ) : (
            <LoadedTableContent
              data={props?.data || []}
              columns={props.columns}
              emptyText={props.emptyText}
            />
          )}
        </TableBody>
      </Table>
      {props.pagination && props.pagination.totalPages > 1 && (
        <div className="flex justify-end">
          <PaginationControl
            size={"sm"}
            {...props.pagination}
            onPageChange={props.onPageChange}
          />
        </div>
      )}
    </div>
  );
}

function LoadedTableContent<T extends readonly Column<string>[]>({
  data,
  emptyText,
  columns,
}: {
  data: TableData<T>;
  emptyText?: string | React.ReactNode;
  columns: T;
}) {
  if (data.length > 0) {
    return data.map((rowData, index) => {
      return (
        <TableRow key={index}>
          {columns.map(({ key, display }, index) => (
            <TableCell
              className={cn(
                getDisplayClass(display),
                "first:pl-4 last:pr-4",
                "whitespace-nowrap"
              )}
              align={columns[index].align}
              key={index}
            >
              {rowData[key as unknown as ColumnKey<T>]}
            </TableCell>
          ))}
        </TableRow>
      );
    });
  }

  return (
    <TableRow>
      <TableCell
        className={cn("py-4 text-sm text-muted-foreground text-center")}
        colSpan={Number.MAX_SAFE_INTEGER}
      >
        {emptyText ?? "No Data"}
      </TableCell>
    </TableRow>
  );
}

function LoadingTableRow() {
  return (
    <TableRow>
      <TableCell colSpan={Number.MAX_SAFE_INTEGER} className="">
        <Skeleton className="h-10 w-full" />
      </TableCell>
    </TableRow>
  );
}

function LoadingTableContent() {
  return new Array(1)
    .fill(0)
    .map((_, index) => <LoadingTableRow key={index} />);
}

function getDisplayClass(display: Column<string>["display"]) {
  if (!display) return "";
  return `hidden ${display}:table-cell`;
}
