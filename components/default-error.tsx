import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 py-4 justify-center items-center">
      <div className="flex flex-col gap-2 justify-center items-center">
        <CircleX className="w-6 h-6 text-red-500" />
        <h2>Something went wrong!</h2>
      </div>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
