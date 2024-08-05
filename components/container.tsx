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
    <main className="p-4 md:px-10">
      <div
        {...props}
        className={cn(
          props.className,
          "mx-auto w-full ",
          "max-w-screen-lg",
          max === "md" && "max-w-screen-md",
          max === "sm" && "max-w-screen-sm",
          max === "xl" && "max-w-screen-xl",
          max === "liquid" && "max-w-full",
        )}
      >
        {children}
      </div>
    </main>
  );
}
