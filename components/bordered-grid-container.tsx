import { cn } from "@/lib/utils";
import React from "react";
interface Props extends React.HtmlHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const BorderedGridContainer = React.forwardRef<HTMLDivElement, Props>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={cn(
          "bg-background rounded-xl border p-6 grid gap-4	shadow",
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

export default BorderedGridContainer;
