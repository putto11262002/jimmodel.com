import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserPassworSchema } from "@/lib/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUserActions } from "../actions-context";
import { SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { resetPasswordAction } from "@/lib/actions/user";
import { useToast } from "@/components/ui/use-toast";

export default function ResetPasswordForm() {
  const { done, target } = useUserActions();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof UserPassworSchema>>({
    resolver: zodResolver(UserPassworSchema),
  });

  const onSubmit = async (formData: z.infer<typeof UserPassworSchema>) => {
    if (target === null) return;
    await resetPasswordAction(target.id, formData.password);
    toast({ title: "Suceess", description: "Password reset successfully" });
    done();
  };

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input type="pasword" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirmPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input type="passwod" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SheetFooter>
          <Button>Save</Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
