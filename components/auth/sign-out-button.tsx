import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <Button onClick={() => signOutAction()} size={"icon"} variant={"outline"}>
      <LogOut className="w-5 h-5 text-muted-foreground" />
    </Button>
  );
}
