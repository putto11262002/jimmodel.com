import { CircleCheck } from "lucide-react";

export default function Page() {
  return (
    <div className="grid gap-4">
      <div className="flex justify-center">
        <CircleCheck className="w-6 h-6 text-green-800" strokeWidth={2} />
      </div>
      <h2 className="font-medium text-center">
        We have received your application. Thank you for submitting your
        application
      </h2>
    </div>
  );
}
