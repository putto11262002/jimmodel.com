import { Suspense } from "react";
import SearchBar from "./search-bar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <SearchBar />
      </Suspense>
      {children}
    </>
  );
}
