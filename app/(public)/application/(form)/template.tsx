import FormContextProvider from "./_components/form-context";
import { Suspense } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <FormContextProvider>
      <div className="w-full max-w-3xl flex flex-col gap-6 md:gap-8 mx-auto">
        <Suspense>{children}</Suspense>
      </div>
    </FormContextProvider>
  );
}
