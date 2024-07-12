import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NewUserImageSchema, UserPassworSchema } from "@/lib/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUserActions } from "../actions-context";
import { SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { resetPasswordAction } from "@/lib/actions/user";
import { useToast } from "@/components/ui/use-toast";
import { useUploadImage } from "@/hooks/queries/user";

export default function UploadImageForm() {
  const { done, target } = useUserActions();

  const form = useForm<z.infer<typeof NewUserImageSchema>>({
    resolver: zodResolver(NewUserImageSchema),
  });

  const { mutate } = useUploadImage({
    opts: { onSuccess: () => done(), onError: () => done() },
  });

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit((formData) =>
          mutate({ file: formData.file, userId: target!.id }),
        )}
      >
        <FormField
          name="file"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => field.onChange(e.target?.files?.[0])}
                />
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
