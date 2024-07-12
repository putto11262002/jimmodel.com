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
import { CreateModelSchema } from "@/lib/validators/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModelCreateInput } from "@/db/schemas/models";
import { addModelAction } from "@/lib/actions/model";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/api/client";
import { Badge } from "@/components/ui/badge";
import useToast from "@/components/toast";

const CreateModelFormSchema = z.object({
  firstName: z.string().min(1, "First name cannot be empty"),
  lastName: z.string().min(1, "Last name cannot be emtpy"),
  gender: CreateModelSchema.shape.gender,
  ethnicity: CreateModelSchema.shape.ethnicity,
  dateOfBirth: z.date(),
});

// transforms the the data in the shape of the form schema to the schema that is compatible with the service layer
const transform = (
  formSchema: z.infer<typeof CreateModelFormSchema>,
): ModelCreateInput => {
  return CreateModelFormSchema.transform((data) => ({
    name: `${data.firstName} ${data.lastName}`,
    gender: data.gender,
    ethnicity: data.ethnicity,
    dateOfBirth: data.dateOfBirth.toISOString(),
  })).parse(formSchema);
};

export default function Page() {
  const router = useRouter();
  const { error } = useToast();

  const form = useForm<z.infer<typeof CreateModelFormSchema>>({
    resolver: zodResolver(CreateModelFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: z.infer<typeof CreateModelFormSchema>) => {
      const res = await client.api.models.$post({
        json: {
          name: `${formData.firstName} ${formData.lastName}`,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          ethnicity: formData.ethnicity,
        },
      });
      return res.json();
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
      router.push(`/admin/models/update/${id}/general`);
    },
    onError: () => {
      error("Failed to add model");
    },
  });

  return (
    <main className="flex  flex-1 flex-col bg-muted/40 p-4 ">
      <div className=" mx-auto w-full max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((formData) => mutate(formData))}>
            <Card>
              <CardHeader>
                <CardTitle> Add New Model</CardTitle>
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
                              selected={field.value ?? undefined}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
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
