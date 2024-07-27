import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormContextProvider from "./_components/form-context";
import Progress from "./_components/progress";
import { upperFirst } from "lodash";
import { Suspense } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <FormContextProvider>
      <div className="w-full max-w-3xl flex flex-col gap-6 md:gap-8 mx-auto">
        <Progress />
        <div className="grid gap-6">
          <Suspense>{children}</Suspense>
        </div>
      </div>
    </FormContextProvider>
  );
}
