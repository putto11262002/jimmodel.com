import { BreakcrumbSetter } from "@/components/breadcrumb";
import SearchBar from "./search-bar";
import { Suspense } from "react";
import Container from "@/components/container";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container className="grid gap-4">
      <BreakcrumbSetter breadcrumbs={[{ label: "Users" }]} />
      <Suspense>
        <SearchBar />
      </Suspense>
      <Suspense>{children}</Suspense>
    </Container>
  );
}
