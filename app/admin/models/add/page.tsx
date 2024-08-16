"use client";
import dayjs from "dayjs";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { genders } from "@/db/data/genders";
import { ethnicties } from "@/lib/data/ethnicities";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { z } from "zod";
import { ModelCreateInputSchema } from "@/lib/validators/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { BreakcrumbSetter } from "@/components/breadcrumb";
import { useCreateModel } from "@/hooks/queries/model";
import DatetimePicker from "@/components/datetime-picker";

const CreateModelFormSchema = ModelCreateInputSchema.pick({
  gender: true,
  ethnicity: true,
}).and(
  z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dateOfBirth: z.date().optional(),
  }),
);

export default function Page() {
  const router = useRouter();

  const form = useForm<z.infer<typeof CreateModelFormSchema>>({
    resolver: zodResolver(CreateModelFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const { mutate, isPending } = useCreateModel();

  return (
    <main className="flex  flex-1 flex-col bg-muted/40 p-4 ">
      <BreakcrumbSetter
        breadcrumbs={[
          { label: "Models", href: "/admin/models" },
          { label: "New Model" },
        ]}
      />
      <div className=" mx-auto w-full max-w-3xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((formData) =>
              mutate(
                {
                  ...formData,
                  name: `${formData.firstName} ${formData.lastName}`,
                  dateOfBirth: formData.dateOfBirth?.toISOString(),
                },
                {
                  onSuccess: ({ id }) =>
                    router.push(`/admin/models/${id}/update`),
                },
              ),
            )}
          >
            <Card>
              <CardHeader>
                <CardTitle>New Model</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="firstName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>First Name</FormLabel>
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
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <DatetimePicker
                          onChange={field.onChange}
                          value={field.value}
                          showTime={false}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="ethnicity"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Ethnicity</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ethnicties.map((ethnicity) => (
                              <SelectItem key={ethnicity} value={ethnicity}>
                                {ethnicity}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled={isPending} type="submit">
                  Save
                  {isPending && (
                    <span className="ml-2">
                      <Loader className="w-4 h-4 animate-spin" />
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </main>
  );
}
