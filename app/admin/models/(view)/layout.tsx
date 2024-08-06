import { Suspense } from "react";
import ViewControl from "./_components/view-control";
import Container from "@/components/container";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="grid gap-4">
      <Suspense>
        <ViewControl />
      </Suspense>
      {children}
    </Container>
  );
}
