import { Suspense } from "react";
import SearchBar from "./search-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-4">
      <Suspense>
        <SearchBar />
      </Suspense>
      {children}
    </main>
  );
}
