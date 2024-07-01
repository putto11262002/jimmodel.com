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
import { genders } from "@/db/schemas/genders";
import { ethnicties } from "@/lib/data/ethnicities";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { z } from "zod";
import { CreateModelSchema } from "@/lib/validators/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModelCreateInput } from "@/db/schemas/models";
import { addModelAction } from "@/lib/actions/model";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const CreateModelFormSchema = z.object({
  firstName: z.string().min(1, "First name cannot be empty"),
  lastName: z.string().min(1, "Last name cannot be emtpy"),
  gender: CreateModelSchema.shape.gender,
  ethnicity: CreateModelSchema.shape.ethnicity,
  dateOfBirth: CreateModelSchema.shape.dateOfBirth,
});

// transforms the the data in the shape of the form schema to the schema that is compatible with the service layer
const transform = (
  formSchema: z.infer<typeof CreateModelFormSchema>,
): ModelCreateInput => {
  return CreateModelFormSchema.transform((data) => ({
    name: `${data.firstName} ${data.lastName}`,
    gender: data.gender,
    ethnicity: data.ethnicity,
    dateOfBirth: data.dateOfBirth,
  })).parse(formSchema);
};

export default function Page() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof CreateModelFormSchema>>({
    resolver: zodResolver(CreateModelFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (formData: z.infer<typeof CreateModelFormSchema>) => {
    const modelId = await addModelAction(transform(formData));
    toast({ title: "Success", description: "Model successfully added" });
    router.push(`/admin/models/update/${modelId}`);
  };

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:px-10">
      <div className=" mx-auto w-full max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      <FormItem>
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
                      <FormItem>
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
                <Button type="submit">Save</Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </main>
  );
}
