import { cn } from "@/lib/utils";
export default function Container({
  children,
  max,
  ...props
}: {
  children: React.ReactNode;
  max?: "sm" | "md" | "lg" | "xl" | "liquid";
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        props.className,
        "mx-auto w-full p-4",
        "max-w-screen-lg",
        max === "md" && "max-w-screen-md",
        max === "sm" && "max-w-screen-sm",
        max === "xl" && "max-w-screen-xl",
        max === "liquid" && "max-w-full",
      )}
    >
      {children}
    </div>
  );
}
