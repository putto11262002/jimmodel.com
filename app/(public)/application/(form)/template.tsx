import Container from "@/components/container";
import FormContextProvider from "./_components/form-context";
import { Suspense } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <FormContextProvider>
      <Container max="sm">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Model Application Form
        </h1>
        <Suspense>{children}</Suspense>
      </Container>
    </FormContextProvider>
  );
}
