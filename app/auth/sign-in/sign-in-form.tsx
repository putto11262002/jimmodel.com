"use client";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { credentialSigninAction } from "../../../lib/actions/auth";

export default function SignInForm() {
  const [state, formAction] = useFormState(credentialSigninAction, {});

  return (
    <form action={formAction} className="grid gap-4">
      {state?.formError && (
        <div className="pt-2 pb-3">
          <Alert variant={"destructive"}>
            <AlertDescription>{state.formError}</AlertDescription>
          </Alert>
        </div>
      )}
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input name="username" type="text" />
        {state?.fieldErrors?.username && (
          <p className="text-xs text-destructive">
            {state.fieldErrors.username}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" required />
        {state?.fieldErrors?.password && (
          <p className="text-xs text-destructive">
            {state.fieldErrors.password}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
}
