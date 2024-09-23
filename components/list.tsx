import { cn } from "@/lib/utils";
import React from "react";
import { Skeleton } from "./ui/skeleton";

const List = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      {...props}
      className={cn("rounded-lg overflow-hidden border", className)}
    />
  );
});

const ListItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => {
  return (
    <li
      className={cn("[&:not(:first-child)]:border-t py-2 px-4", className)}
      {...props}
      ref={ref}
    />
  );
});

export function DataList<T>({
  data,
  renderItem,
  emptyComponent,
  border = true,
}: {
  data?: T[];
  renderItem: (item: T) => React.ReactNode;
  emptyComponent?: React.ReactNode;
  border?: boolean;
}) {
  return (
    <List className={cn(border ? "border" : "border-none")}>
      {!data ? (
        <Skeleton className="w-full h-10" />
      ) : data.length > 0 ? (
        data.map((item, index) => (
          <ListItem key={index}>{renderItem(item)}</ListItem>
        ))
      ) : (
        <ListItem className="text-sm text-muted-foreground text-center px-2">
          {emptyComponent || "No Data"}
        </ListItem>
      )}
    </List>
  );
}
