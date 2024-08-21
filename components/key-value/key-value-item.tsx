import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  value: string | ReactNode;
  _key: string | number | ReactNode;
  sameLine?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  gap?: "sm" | "md" | "lg";
  hideWhenEmpty?: boolean;
};

export default function KeyValueItem({
  sameLine = true,
  size = "sm",
  gap = "md",
  hideWhenEmpty = false,
  ...props
}: Props) {
  function renderKey() {
    if (typeof props._key === "string") {
      return <p className={cn("font-medium")}>{props._key}</p>;
    } else {
      return <>{props._key}</>;
    }
  }

  function renderValue() {
    if (typeof props.value === "string" || typeof props.value === "number") {
      return <p className={cn("text-muted-foreground")}>{props.value}</p>;
    } else if (props.value) {
      return <>{props.value}</>;
    } else {
      return <p className={cn("text-muted-foreground")}>{"-"}</p>;
    }
  }

  if (hideWhenEmpty && !props.value) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center ",
        !sameLine && "grid ",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "xs" && "text-xs",
        size === "lg" && "text-lg",
        gap === "sm" && "gap-1",
        gap == "md" && "gap-2",
        gap == "lg" && "gap-3",
      )}
    >
      {renderKey()}
      {renderValue()}
    </div>
  );
}
