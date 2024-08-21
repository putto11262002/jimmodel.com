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
import { Input } from "@/components/ui/input";
import { UpdateModelSchema } from "@/lib/validators/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGetModel, useUpdateModel } from "@/hooks/queries/model";
import FormSkeleton from "../form-skeleton";
import useSession from "@/hooks/use-session";
import permissions from "@/config/permission";
import { Model } from "@/lib/types/model";

const FormDataSchema = UpdateModelSchema;

export default function Page({ params: { id } }: { params: { id: string } }) {
  const session = useSession(permissions.models.getModelById);
  const { data, isSuccess } = useGetModel({
    modelId: id,
    enabled: session.status === "authenticated",
  });

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
          className=""
          onSubmit={form.handleSubmit((formData) =>
            mutate({ modelId: model.id, input: formData }),
          )}
        >
          <Card>
            <CardHeader>
              <CardTitle>Indentification Info</CardTitle>
              <CardDescription>
                Model Identification information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="passportNumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Passport Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="idCardNumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>ID Card Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="taxId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Tax ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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
