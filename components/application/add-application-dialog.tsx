import { z } from "zod";
import { useForm } from "react-hook-form";
import { ApplicationExperienceCreateInputSchema } from "@/lib/validators/application";
import { ApplicationExperienceCreateInput } from "@/lib/types/application";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Plus } from "lucide-react";
import { useState } from "react";
import { stringToNumber } from "@/lib/utils/validator";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { countryNames } from "@/db/data/countries";

const newExperienceFormDataSchema = ApplicationExperienceCreateInputSchema.omit(
  { year: true },
).and(
  z.object({
    year: stringToNumber,
  }),
);

export default function AddNewExperienceDialog({
  onSubmit,
  children,
}: {
  onSubmit: (data: ApplicationExperienceCreateInput) => void;
  children: React.ReactNode;
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
      <DialogTrigger asChild>{children}</DialogTrigger>
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
                  <Select
                    defaultValue={field.value}
                    onValueChange={(v) => field.onChange(v)}
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
