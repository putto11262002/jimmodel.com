import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:border-gray-800 dark:focus:ring-gray-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gray-900 text-gray-50 shadow hover:bg-gray-900/80 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/80",
        secondary:
          "dark:border-transparent border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
        // destructive:
        //   "border-transparent bg-red-500 text-gray-50 shadow hover:bg-red-500/80 dark:bg-red-900 dark:text-gray-50 dark:hover:bg-red-900/80",
        outline: "text-gray-950 dark:text-gray-50",
        destructive:
          "dark:border-transparent border-transparent bg-red-100/90 text-red-600 shadow-sm hover:bg-red-200/90 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900",
        success:
          "dark:border-transparent border-transparent bg-emerald-100/90 text-emerald-600 shadow-sm hover:bg-emerald-200/90 dark:bg-emerald-950 dark:text-emerald-400 dark:hover:bg-emerald-900",
        warning:
          "dark:border-transparent border-transparent bg-yellow-100/90 text-yellow-600 shadow-sm hover:bg-yellow-200/90 dark:bg-yellow-950 dark:text-yellow-400 dark:hover:bg-yellow-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
