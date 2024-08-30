import { Button } from "@/components/ui/button";
import AuthorisationError from "@/lib/errors/authorisation-error";
import HttpError from "@/lib/errors/http-error";
import { CircleX } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  let message = "Something went wrong!";

  if (error instanceof HttpError) {
    message = error.message;
  }

  if (error instanceof AuthorisationError) {
    message = error.message;
  }

  return (
    <div className="flex flex-col gap-4 py-4 justify-center items-center h-auto">
      <div className="flex flex-col gap-2 justify-center items-center">
        <CircleX className="w-6 h-6 text-red-500" />
        <h2>{message}</h2>
      </div>
    </div>
  );
}
