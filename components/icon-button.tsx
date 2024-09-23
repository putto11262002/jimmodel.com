import React from "react";
import { Button, ButtonProps } from "./ui/button";

const IconButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { icon: React.ReactNode; text: string }
>(({ icon, text, ...props }, ref) => {
  return (
    <Button {...props} ref={ref}>
      {icon} <span className="ml-2">{text}</span>
    </Button>
  );
});

export default IconButton;
