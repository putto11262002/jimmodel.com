import React from "react";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "@/lib/utils";

const IconButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    icon: React.ReactNode;
    text: string;
    hideIconOnMobile?: boolean;
  }
>(({ icon, text, hideIconOnMobile = false, ...props }, ref) => {
  return (
    <Button {...props} ref={ref}>
      {icon}{" "}
      <span className={cn("ml-2", hideIconOnMobile && "hidden md:inline")}>
        {text}
      </span>
    </Button>
  );
});

export default IconButton;
