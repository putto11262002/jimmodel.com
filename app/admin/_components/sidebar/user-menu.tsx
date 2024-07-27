"use client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";

export default function UserMenu() {
  return (
    <div className="mt-auto flex flex-col items-center gap-6 py-5">
      <Button
        onClick={async () => await signOutAction()}
        size={"icon"}
        variant={"ghost"}
      >
        <LogOut className="w-5 h-5 text-muted-foreground" />
      </Button>
    </div>
  );
}
