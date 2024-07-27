import { BreakcrumbSetter } from "@/components/breadcrumb";
import UserActionsProvider from "./actions-context";
import UserActionForms from "./forms";
import SearchBar from "./search-bar";
import { Suspense } from "react";
import permissions from "@/config/permission";
import { auth } from "@/lib/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await auth(permissions.users.getUsers);
  return (
    <UserActionsProvider>
      <BreakcrumbSetter breadcrumbs={[{ label: "Users" }]} />
      <UserActionForms />
      <Suspense>
        <SearchBar />
      </Suspense>
      {children}
    </UserActionsProvider>
  );
}
