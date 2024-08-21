"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { UpdateModelSchema } from "@/lib/validators/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useGetModel, useUpdateModel } from "@/hooks/queries/model";
import FormSkeleton from "../form-skeleton";
import { Model } from "@/lib/types/model";

const FormDataSchema = UpdateModelSchema;

export default function Page({ params: { id } }: { params: { id: string } }) {
  const { data, isSuccess } = useGetModel({ modelId: id });
  if (!isSuccess) {
    return <FormSkeleton />;
  }
  return <PageContent model={data} />;
}

function PageContent({ model }: { model: Model }) {
  const form = useForm<z.infer<typeof FormDataSchema>>({
    resolver: zodResolver(UpdateModelSchema),
    defaultValues: model,
  });
  const { mutate } = useUpdateModel();

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((formData) =>
            mutate({ modelId: model.id, input: formData }),
          )}
          className=""
        >
          <Card>
            <CardHeader>
              <CardTitle>General Info</CardTitle>
              <CardDescription>Model general informatioh</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="aboutMe"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>About Me</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="underwareShooting"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Underware Shooting</FormLabel>
                      <Switch
                        className="block"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
