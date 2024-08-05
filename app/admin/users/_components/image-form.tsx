import Avatar from "@/components/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserWithoutSecrets } from "@/lib/types/user";
import { blobToFile } from "@/lib/utils/file";
import { NewUserImageSchema } from "@/lib/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function ImageForm({
  user,
  onSubmit,
}: {
  user: UserWithoutSecrets;
  onSubmit: (image: File) => void;
}) {
  const form = useForm<z.infer<typeof NewUserImageSchema>>({
    resolver: zodResolver(NewUserImageSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          onSubmit(await blobToFile(data.file));
          form.reset({});
        })}
      >
        <Card>
          <CardHeader>
            <CardTitle>Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Avatar size="large" fileId={user.imageId} name={user.name} />
              <FormField
                name="file"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
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
            </div>
          </CardContent>
          <CardFooter className="py-4 border-t">
            <Button>Save</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
