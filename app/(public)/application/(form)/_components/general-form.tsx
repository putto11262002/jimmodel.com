"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useFormContext } from "./form-context";
import { ApplicationCreateInputSchema } from "@/lib/validators/application";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { genders } from "@/db/data/genders";
import { upperFirst } from "lodash";
import { ethnicities } from "@/db/data/ethnicities";
import { countryNames } from "@/db/data/countries";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DatetimePicker from "@/components/datetime-picker";

const formDataSchema = ApplicationCreateInputSchema.pick({
  name: true,
  gender: true,
  ethnicity: true,
  nationality: true,
}).and(
  z.object({
    dateOfBirth: z.date(),
  }),
);

export default function GeneralForm() {
  const form = useForm<z.infer<typeof formDataSchema>>({
    resolver: zodResolver(formDataSchema),
  });

  const { setApplication, next } = useFormContext();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          setApplication((prev) => ({
            ...prev,
            ...data,
            dateOfBirth: data.dateOfBirth.toISOString(),
          }));
          next();
        })}
      >
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Model General Information</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
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
              name="gender"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Gender</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genders.map((gender, index) => (
                        <SelectItem key={index} value={gender}>
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
                <FormItem className="col-span-1 space-y-2">
                  <FormLabel>Date of Birth</FormLabel>
                  <DatetimePicker
                    showTime={false}
                    onChange={field.onChange}
                    value={field.value}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="ethnicity"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ethnicity</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ethnicities.map((gender, index) => (
                        <SelectItem key={index} value={gender}>
                          {upperFirst(gender)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              name="nationality"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countryNames.map((country, index) => (
                        <SelectItem key={index} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button className="ml-auto" type="submit">
              Next
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
