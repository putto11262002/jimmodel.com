import { CircleX } from "lucide-react";

export default function DefaultError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
}) {
  let message = "Something went wrong!";

  return (
    <div className="flex flex-col gap-6 py-6 justify-center items-center h-auto">
      <div className="flex flex-col justify-center items-center">
        <CircleX className="w-8 h-8 text-red-500" />
        <h2 className="font-medium mt-1">{message}</h2>
        {error.digest && (
          <p className="text-muted-foreground text-sm mt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
