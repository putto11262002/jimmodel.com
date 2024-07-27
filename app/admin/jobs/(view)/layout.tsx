import { Suspense } from "react";
import SearchBar from "./_components/search-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <SearchBar />
      </Suspense>
      <Suspense>{children}</Suspense>
    </>
  );
}
