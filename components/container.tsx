import resolveConfig from "tailwindcss/resolveConfig";
import _tailwindConfig from "@/tailwind.config.js";
import { cn } from "@/lib/utils";
const tailwindConfig = resolveConfig(_tailwindConfig);
export default function Container({
  children,
  max,
}: {
  children: React.ReactNode;
  max: "sm" | "md" | "lg" | "xl" | "liquid";
}) {
  return (
    <main className="p-4 md:px-10">
      <div
        className={cn(
          "mx-auto w-full gap-4 grid",
          "max-w-screen-sm",
          max === "md" && "max-w-screen-md",
          max === "lg" && "max-w-screen-lg",
          max === "xl" && "max-w-screen-xl",
          max === "liquid" && "max-w-full",
        )}
      >
        {children}
      </div>
    </main>
  );
}
