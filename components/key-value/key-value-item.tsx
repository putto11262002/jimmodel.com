import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ReactNode } from "react";
const textCva = cva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
    weight: {
      base: "",
      medium: "font-medium",
      bold: "font-semibold",
    },
    line: {
      break: "block",
      nobreak: "",
    },
  },
  defaultVariants: {
    size: "md",
    weight: "base",
    line: "nobreak",
  },
});

const itemCva = cva("flex", {
  variants: {
    line: {
      break: "flex-col",
      nobreak: "",
    },
    size: {
      xs: "gap-0.5",
      sm: "gap-1.5",
      md: "gap-1.5",
      lg: "gap-2",
    },
  },
  defaultVariants: {
    line: "nobreak",
    size: "md",
  },
});

const itemLabelCva = cva("grid", {
  variants: {
    size: {
      xs: "",
      sm: "",
      md: "",
      lg: "gap-1.5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
type ItemsProps = VariantProps<typeof itemCva>;
type TextProps = VariantProps<typeof textCva>;
type Props = {
  value: string | ReactNode;
  label: string | number | ReactNode;
  line?: "break" | "nobreak";
  size?: TextProps["size"];
  weight?: TextProps["weight"];
  labelSize?: TextProps["size"];
  labelWieght?: TextProps["weight"];
  valueSize?: TextProps["size"];
  valueWeight?: TextProps["weight"];
  placeholder?: string;
  description?: string;
};

export default function LabelValueItem({
  line,
  size,
  weight,
  valueWeight,
  valueSize,
  labelSize,
  labelWieght,
  placeholder = "-",
  ...props
}: Props) {
  function renderLabel() {
    if (typeof props.label === "string") {
      return (
        <div
          className={cn(
            textCva({
              size: labelSize || size,
              weight: labelWieght || weight,
              line,
            }),
            "text-muted-foreground flex-none"
          )}
        >
          {props.label}
        </div>
      );
    } else {
      return <>{props.label}</>;
    }
  }

  function renderValue() {
    if (typeof props.value === "string" || typeof props.value === "number") {
      return (
        <div
          className={cn(
            textCva({
              size: valueSize || size,
              weight: valueWeight || weight,
              line,
            }),
            "flex-1 overlow"
          )}
        >
          {props.value}
        </div>
      );
    } else if (props.value) {
      return <>{props.value}</>;
    } else {
      return placeholder ? (
        <div
          className={cn(
            textCva({ size: valueSize || size, weight: valueWeight || weight }),
            "text-muted-foreground"
          )}
        >
          {placeholder}
        </div>
      ) : null;
    }
  }

  return (
    <div className={itemCva({ size, line })}>
      <div className={itemLabelCva({ size })}>
        {renderLabel()}
        <p className="text-muted-foreground/80 text-xs">{props.description}</p>
      </div>
      {renderValue()}
    </div>
  );
}
