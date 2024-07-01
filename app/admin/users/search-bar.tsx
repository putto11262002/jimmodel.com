"use client";
import { Button } from "@/components/ui/button";
import RoleFilter from "./role-filter";
import { PlusCircle } from "lucide-react";
import { UserAction, useUserActions } from "./actions-context";

export default function SearchBar() {
  const { invoke: startAction } = useUserActions();
  return (
    <div className="flex items-center">
      <div className="ml-auto flex items-center gap-2">
        <RoleFilter />
        <Button
          onClick={() =>
            startAction({
              title: "AddNew User",
              action: UserAction.AddUser,
              target: null,
            })
          }
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
