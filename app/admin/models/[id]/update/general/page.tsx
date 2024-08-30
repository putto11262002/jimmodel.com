"use client";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { genders } from "@/lib/types/common";
import { UpdateModelSchema } from "@/lib/validators/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGetModel, useUpdateModel } from "@/hooks/queries/model";
import FormSkeleton from "../form-skeleton";
import useSession from "@/hooks/use-session";
import permissions from "@/config/permission";
import DatetimePicker from "@/components/datetime-picker";
import { upperFirst } from "lodash";
import { Model } from "@/lib/types/model";

const FormDataSchema = UpdateModelSchema.omit({
  dateOfBirth: true,
}).and(z.object({ dateOfBirth: z.date().optional() }));

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
  const { mutate } = useUpdateModel();
  const form = useForm<z.infer<typeof FormDataSchema>>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      ...model,
      dateOfBirth: model.dateOfBirth ? new Date(model.dateOfBirth) : undefined,
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((formData) => {
            mutate({
              modelId: model.id,
              input: {
                ...formData,
                dateOfBirth: formData?.dateOfBirth?.toISOString(),
              },
            });
          })}
          className=""
        >
          <Card>
            <CardHeader>
              <CardTitle>General Info</CardTitle>
              <CardDescription>Model general information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="nickname"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Nickname </FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="gender"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {genders.map((gender) => (
                            <SelectItem key={gender} value={gender}>
                              {upperFirst(gender)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="dateOfBirth"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-full">
                      <FormLabel>Date of Birth</FormLabel>
                      <DatetimePicker
                        value={field.value}
                        onChange={field.onChange}
                        showTime={false}
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
