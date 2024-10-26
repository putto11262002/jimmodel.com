import { cn } from "@/lib/utils";
import React from "react";

const FormMessage = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & { error?: string[] }
>(({ error, className, ...props }, ref) =>
  error && error.length > 0 ? (
    <div
      ref={ref}
      {...props}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
    >
      {error[0]}
    </div>
  ) : null
);

export default FormMessage;
