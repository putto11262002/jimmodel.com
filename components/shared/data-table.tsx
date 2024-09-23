"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

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
    border: {
      true: "border",
      false: "",
    },
  },
  defaultVariants: {
    rounded: true,
    showdow: false,
    border: false,
  },
});

type TableContainerCvaProps = VariantProps<typeof tableContainerCva>;

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

type CellCvaProps = VariantProps<typeof cellCva>;

type BaseColumnConfig = {
  header?: string;
  align?: CellCvaProps["align"];
  hidden?: CellCvaProps["hidden"];
};

type CellRender<TData> = (props: { data: TData }) => React.ReactNode;

// Utility type to check if a value type is `string | React.ReactNode`
type IsStringOrReactNode<T> = T extends string | React.ReactNode ? true : false;

// Helper types for optional or required render
type ColumnConfigWithOptionalRender<TData> = BaseColumnConfig & {
  render?: CellRender<TData>;
};
type ColumnConfigWithRender<TData> = BaseColumnConfig & {
  render: CellRender<TData>;
};

// Column definition based on whether the key exists in TData and its type
type ColumnDef<TData extends { [key: string]: any }> = {
  [K in keyof TData]: K extends keyof TData
    ? IsStringOrReactNode<TData[K]> extends true
      ? ColumnConfigWithOptionalRender<TData>
      : ColumnConfigWithRender<TData>
    : ColumnConfigWithRender<TData>;
};

type Props<TData extends { [key: string | number]: any }> = {
  columns: ColumnDef<TData>;
  data: TData[];
  placeholder?: string | React.ReactNode;
  border?: TableContainerCvaProps["border"];
  shadow?: TableContainerCvaProps["showdow"];
  rounded?: TableContainerCvaProps["rounded"];
};

export default function DataTable<TData extends { [key: string]: any }>(
  props: Props<TData>
) {
  return (
    <div className={cn(tableContainerCva({ ...props }))}>
      <Table>
        <TableHeader>
          <TableRow>
            {Object.entries(props.columns).map(([key, column], index) => (
              <TableHead
                className={cn(
                  cellCva({ align: column.align, hidden: column.hidden })
                )}
                key={index}
              >
                <span className={cn("sr-only")}>{column.header || key}</span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.data.length > 0 ? (
            props.data.map((data, index) => (
              <TableRow key={index}>
                {Object.entries(props.columns).map(([key, column], index) => (
                  <TableCell className={cn(cellCva({ ...column }))} key={index}>
                    {"render" in column && typeof column.render === "function"
                      ? column.render({ data: data })
                      : data[key as keyof TData]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                className={cn("py-4 text-sm text-muted-foreground text-center")}
                colSpan={Number.MAX_SAFE_INTEGER}
              >
                {props.placeholder ?? "No Data"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
