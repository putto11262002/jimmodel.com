"use client";
import Avatar from "@/components/avatar";
import Loader from "@/components/loader";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { imageDim } from "@/config/image";
import permissions from "@/config/permission";
import { useGetModel, useUpdateProfileImage } from "@/hooks/queries/model";
import useSession from "@/hooks/use-session";
import client from "@/lib/api/client";
import { blobToFile } from "@/lib/utils/file";
import { imageValidator } from "@/lib/validators/file";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  file: imageValidator(),
});

export default function Page({ params: { id } }: { params: { id: string } }) {
  const session = useSession(permissions.models.setProfileImageById);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { data, isSuccess } = useGetModel({
    modelId: id,
    enabled: session.status === "authenticated",
  });
  const { mutate } = useUpdateProfileImage();
  if (!isSuccess) {
    return <Loader />;
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) =>
          mutate({ modelId: id, file: await blobToFile(data.file) }),
        )}
      >
        <Card>
          <CardHeader>
            <CardTitle>Profile Image</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Avatar
              size={"large"}
              fileId={data.profileImage?.id}
              name={data.name}
            />
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
          </CardContent>

          <CardFooter className="py-4 border-t">
            <Button>Save</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
