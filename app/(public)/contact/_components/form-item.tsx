import { Label } from "@/components/ui/label";
import React from "react";
import { cn } from "@/lib/utils";
type FormItemProps = React.HTMLAttributes<HTMLDivElement> & {
  error: string[] | undefined;
  name: string;
  label: string;
  render: (props: { name: string }) => JSX.Element;
};
const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ error, label, name, render, className, ...props }, ref) => {
    return (
      <div {...props} className={cn("space-y-2", className)} ref={ref}>
        <Label className={cn(error && "text-destructive")} htmlFor="firstName">
          {label}
        </Label>
        {render({ name })}
        {error && (
          <p className="text-xs text-destructive font-medium">{error?.[0]}</p>
        )}
      </div>
    );
  },
);

export default FormItem;
