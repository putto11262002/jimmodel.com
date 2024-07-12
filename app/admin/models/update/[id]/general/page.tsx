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
import { genders } from "@/db/data/genders";
import { cn } from "@/lib/utils";
import { UpdateModelSchema } from "@/lib/validators/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGetModel, useUpdateModel } from "@/hooks/queries/model";
import FormSkeleton from "../form-skeleton";
import { useParams } from "next/navigation";
import { Model } from "@/db/schemas";

const FormDataSchema = UpdateModelSchema.omit({
  dateOfBirth: true,
}).and(z.object({ dateOfBirth: z.date() }));

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { data, isSuccess } = useGetModel({ modelId: id });

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
                              {gender}
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                              variant={"outline"}
                            >
                              {field.value ? ( // format(field.value, "PPP")
                                dayjs(field.value).format("MMM DD, YYYY")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value!}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
