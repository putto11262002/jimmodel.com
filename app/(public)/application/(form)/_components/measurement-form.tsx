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
import { Button } from "@/components/ui/button";
import { stringToNumber } from "@/lib/utils/validator";
import { hairColors } from "@/db/data/hair-colors";
import { eyeColors } from "@/db/data/eye-colors";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formDataSchema = ApplicationCreateInputSchema.pick({
  eyeColor: true,
  hairColor: true,
  suitDressSize: true,
}).and(
  z.object({
    height: stringToNumber.optional(),
    weight: stringToNumber.optional(),
    bust: stringToNumber.optional(),
    hips: stringToNumber.optional(),
    shoeSize: stringToNumber.optional(),
  }),
);

export default function MeausrementForm() {
  const form = useForm<z.infer<typeof formDataSchema>>({
    resolver: zodResolver(formDataSchema),
  });

  const { setApplication, next } = useFormContext();

  return (
    <Form {...form}>
      <form
        className=""
        onSubmit={form.handleSubmit((data) => {
          setApplication((prev) => ({ ...prev, ...data }));
          next();
        })}
      >
        <Card>
          <CardHeader>
            <CardTitle>Measurements</CardTitle>
            <CardDescription>Model measurements</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              name="height"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="weight"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="bust"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bust (inches)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="hips"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hips (inches)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              name="suitDressSize"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suite/Dress Size</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="shoeSize"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shoe Size (US)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="hairColor"
              control={form.control}
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormLabel>Hair Color</FormLabel>
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
                      {hairColors.map((hairColor) => (
                        <SelectItem key={hairColor} value={hairColor}>
                          {hairColor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="eyeColor"
              control={form.control}
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormLabel>Eye Color</FormLabel>
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
                      {eyeColors.map((eyeColor) => (
                        <SelectItem key={eyeColor} value={eyeColor}>
                          {eyeColor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t py-4">
            <Button className="ml-auto" type="submit">
              Next
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
