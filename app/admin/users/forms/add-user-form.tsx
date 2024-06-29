import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { addUserAction } from "@/lib/actions/user";
import { NewUserSchema } from "@/lib/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React from "react";
import Alert from "@/components/alert";
import { SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserActions } from "../actions-context";

export default function AddUserForm() {
  const { done } = useUserActions();
  const form = useForm<z.infer<typeof NewUserSchema>>({
    resolver: zodResolver(NewUserSchema),
    defaultValues: {},
  });

  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const onSubmit = async (data: z.infer<typeof NewUserSchema>) => {
    try {
      await addUserAction({
        username: data.username,
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        password: data.password,
      });
      form.reset({});
      toast({ title: "Success", description: "User added successfully" });
      done();
    } catch (e) {
      if (e instanceof Error) {
        setErrorMessage(e.message);
        return;
      }
      toast({
        title: "Error",
        description: "An error occurred while adding user",
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4 py-4">
          {errorMessage && (
            <div className="col-span-2 py-3">
              <Alert variant="error">{errorMessage}</Alert>
            </div>
          )}
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-1	">
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-1	">
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2	">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2	">
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
              <FormItem className="col-span-2	">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2	">
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SheetFooter>
          <Button type="submit">Save</Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
