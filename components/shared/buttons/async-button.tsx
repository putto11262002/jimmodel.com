import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";
export type AsyncButtonProps = ButtonProps & {
  pending?: boolean;
};
const AsyncButton = React.forwardRef<HTMLButtonElement, AsyncButtonProps>(
  ({ pending = false, disabled, children, ...props }, ref) => {
    return (
      <Button {...props} disabled={pending || disabled} ref={ref}>
        <span> {props.size === "icon" && pending ? null : children}</span>

        {pending && (
          <Loader2
            className={cn(
              "icon-md animate-spin ml-2",
              props.size === "sm" && "icon-sm",
              props.size === "lg" && "icon-lg"
            )}
          />
        )}
      </Button>
    );
  }
);

export default AsyncButton;
