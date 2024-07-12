import { Suspense } from "react";
import SearchBar from "./search-bar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import PageSkeleton from "./_page-skeleton";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-4">
      <Suspense>
        <SearchBar />
      </Suspense>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Models</CardTitle>
        </CardHeader>
        {children}
      </Card>
    </main>
  );
}
