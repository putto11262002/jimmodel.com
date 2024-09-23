import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";
import React from "react";

const alertCva = cva("py-2 px-4 border rounded-lg text-sm", {
  variants: {
    variant: {
      default: "bg-gray-500/20 border border-gray-600 text-gray-600",
      error:
        "bg-red-500/20 text-red-500 shadow-sm hover:bg-red-500/20 dark:bg-red-900/20 dark:text-red-500 dark:hover:bg-red-900/20",
      destructive:
        "bg-red-500/20 text-red-500 shadow-sm hover:bg-red-500/20 dark:bg-red-900/20 dark:text-red-500 dark:hover:bg-red-900/20",
      success:
        "bg-green-500/20 text-green-500 shadow-sm hover:bg-green-500/20 dark:bg-green-900/20 dark:text-green-500 dark:hover:bg-green-900/20",
      warning:
        "bg-yellow-500/20 text-yellow-500 shadow-sm hover:bg-yellow-500/20 dark:bg-yellow-900/20 dark:text-yellow-500 dark:hover:bg-yellow-900/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type AlertCvaProps = VariantProps<typeof alertCva>;

export type AlertProps = {
  variant: AlertCvaProps["variant"];
} & React.HTMLAttributes<HTMLDivElement>;
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div {...props} className={clsx(alertCva({ variant }), className)}></div>
    );
  }
);

export default Alert;
