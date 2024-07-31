import { cn } from "@/lib/utils";
export default function Container({
  children,
  max,
}: {
  children: React.ReactNode;
  max?: "sm" | "md" | "lg" | "xl" | "liquid";
}) {
  return (
    <main className="p-4 md:px-10">
      <div
        className={cn(
          "mx-auto w-full gap-4 grid",
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
