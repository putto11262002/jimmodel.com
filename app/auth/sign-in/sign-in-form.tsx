"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/lib/validators/auth";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSignIn } from "@/hooks/queries/auth";

export default function SignInForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
  });

  const { mutate, isPending } = useSignIn();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          mutate(data, {
            onSuccess: () => router.push("/admin"),
            onError: (error) => setErrorMessage(error.message),
          }),
        )}
        className="grid gap-4"
      >
        {errorMessage && (
          <div className="pt-2 pb-3">
            <Alert variant={"destructive"}>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </div>
        )}
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit" className="w-full">
          Login
        </Button>
      </form>
    </Form>
  );
}
