"use client";
import { Button } from "@/components/ui/button";
import RoleFilter from "./role-filter";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import useSession from "@/hooks/use-session";
import { hasPermission } from "@/lib/utils/auth";
import permissions from "@/config/permission";

export default function SearchBar() {
  const router = useRouter();
  const { data, status } = useSession();
  return (
    <div className="flex items-center">
      <div className="ml-auto flex items-center gap-2">
        <RoleFilter />
        <Button
          disabled={
            status === "loading" ||
            !hasPermission(data.user.roles, permissions.users.createUser)
          }
          onClick={() => router.push("/admin/users/create")}
          size="sm"
          className="h-7 gap-1"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add user
          </span>
        </Button>
      </div>
    </div>
  );
}
