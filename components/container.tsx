import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

export const containerCva = cva("", {
  variants: {
    max: {
      sm: "max-w-screen-sm",
      md: "max-w-screen-md",
      lg: "max-w-screen-lg",
      xl: "max-w-screen-xl",
      liquid: "max-w-full",
    },
  },
  defaultVariants: {
    max: "lg",
  },
});

export type ContainerCvaProps = VariantProps<typeof containerCva>;

export default function Container({
  children,
  max,
  ...props
}: {
  children: React.ReactNode;
  max?: ContainerCvaProps["max"];
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "mx-auto w-full px-4 py-6",
        containerCva({ max }),
        props.className
      )}
    >
      {children}
    </div>
  );
}
