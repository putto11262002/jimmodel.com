import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserActionsProvider from "./actions-context";
import UserActionForms from "./forms";
import SearchBar from "./search-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UserActionsProvider>
      <UserActionForms />
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-4">
        <SearchBar />
        {children}
      </main>
    </UserActionsProvider>
  );
}
