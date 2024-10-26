import * as React from "react";

import { cn } from "@/lib/utils";
import { BoxSize } from "../shared/types/box";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "size"
> & {
  value?: React.InputHTMLAttributes<HTMLInputElement>["value"] | null;
} & { size?: BoxSize };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, size = "default", ...props }, ref) => {
    return (
      <input
        value={value ?? undefined}
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300",
          size === "default" ? "h-9" : "h-7 px-2 text-xs",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
