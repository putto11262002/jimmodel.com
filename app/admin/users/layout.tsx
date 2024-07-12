import UserActionsProvider from "./actions-context";
import UserActionForms from "./forms";
import SearchBar from "./search-bar";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UserActionsProvider>
      <UserActionForms />
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-4">
        <Suspense>
          <SearchBar />
        </Suspense>
        {children}
      </main>
    </UserActionsProvider>
  );
}
