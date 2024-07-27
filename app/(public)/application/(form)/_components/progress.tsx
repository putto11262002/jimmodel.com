"use client";
import { forms, useFormContext } from "./form-context";
import { Progress as _Progress } from "@/components/ui/progress";

export default function Progress() {
  const { formIndex } = useFormContext();
  return (
    <div className="grid gap-2 px-4 py-4 shadow rounded-lg">
      <h2 className="font-semibold text-center">Model Application</h2>
      <_Progress value={(formIndex / (forms.length - 1)) * 100} />
    </div>
  );
}
