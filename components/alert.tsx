import clsx from "clsx";

export default function Alert({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "error" | "success" | "warning" | "info";
}) {
  return (
    <p
      className={clsx(
        "py-2 px-4 border  rounded-md text-sm",
        variant === "error" && "border-red-300 bg-red-100/60 text-red-500",
      )}
    >
      {children}
    </p>
  );
}
