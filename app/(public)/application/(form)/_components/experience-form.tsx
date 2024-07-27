"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { useFormContext } from "./form-context";
import {
  ApplicationCreateInputSchema,
  ApplicationExperienceCreateInputSchema,
} from "@/lib/validators/application";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { ApplicationExperienceCreateInput } from "@/lib/types/application";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { stringToNumber } from "@/lib/utils/validator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formDataSchema = ApplicationCreateInputSchema.pick({
  experiences: true,
});

export default function ExpereicensForm() {
  const form = useForm<z.infer<typeof formDataSchema>>({
    resolver: zodResolver(formDataSchema),
    defaultValues: { experiences: [] },
  });

  const experiences = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  const { next, setApplication } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experience</CardTitle>
        <CardDescription>Model experiences</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Year</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Media</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.fields.map((experience, index) => (
              <TableRow key={index}>
                <TableCell>{experience.year}</TableCell>
                <TableCell>{experience.product}</TableCell>
                <TableCell>{experience.media}</TableCell>
                <TableCell>{experience.country}</TableCell>
                <TableCell>{experience.details}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => experiences.remove(index)}
                    size={"icon"}
                    variant={"outline"}
                    className="w-7 h-7"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-center mt-4">
          <AddNewExperienceDialog
            onSubmit={(data) => experiences.append(data)}
          />
        </div>
      </CardContent>
      <CardFooter className="py-4 border-t">
        <Button
          onClick={() => {
            setApplication((prev) => ({
              ...prev,
              experiences: experiences.fields,
            }));
            next();
          }}
          className="ml-auto"
          type="submit"
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
const newExperienceFormDataSchema = ApplicationExperienceCreateInputSchema.omit(
  { year: true },
).and(
  z.object({
    year: stringToNumber,
  }),
);
function AddNewExperienceDialog({
  onSubmit,
}: {
  onSubmit: (data: ApplicationExperienceCreateInput) => void;
}) {
  const form = useForm<z.infer<typeof newExperienceFormDataSchema>>({
    resolver: zodResolver(newExperienceFormDataSchema),
    defaultValues: {
      year: undefined,
      product: undefined,
      media: undefined,
      country: undefined,
      details: undefined,
    },
  });
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-7" size={"sm"} variant={"outline"}>
          <Plus className="w-3.5 h-3.5" />{" "}
          <span className="ml-2">Experience</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            className="grid grid-cols-2 gap-4"
            onSubmit={form.handleSubmit((data) => {
              onSubmit(data);
              form.reset({
                year: undefined,
                product: undefined,
                media: undefined,
                country: undefined,
                details: undefined,
              });
              setOpen(false);
            })}
          >
            <FormField
              name="year"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="media"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="product"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="country"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="details"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Details</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-full">
              <Button>Add</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
