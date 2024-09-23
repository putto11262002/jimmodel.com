import { cn } from "@/lib/utils";
import React from "react";
import { BoxSize } from "../shared/types/box";

export type FormItemProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: "vertical" | "horizontal";
  size?: BoxSize;
};

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, orientation = "vertical", size = "md", ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      className={cn(
        orientation === "horizontal" ? "flex items-center" : "flex flex-col",
        size === "sm" ? "gap-1" : "gap-2",
        className
      )}
    />
  )
);

export default FormItem;
