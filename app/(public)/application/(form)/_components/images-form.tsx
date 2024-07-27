"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFormContext } from "./form-context";
import { imageValidator } from "@/lib/validators/file";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FormDataSchema = z.object({
  half: imageValidator().optional(),
  closeup: imageValidator().optional(),
  full: imageValidator().optional(),
});

export default function ImagesForm() {
  const form = useForm<z.infer<typeof FormDataSchema>>({
    resolver: zodResolver(FormDataSchema),
  });

  const { next, appendImage } = useFormContext();

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit((data) => {
          if (data.closeup) {
            appendImage({ file: data.closeup, type: "closeup" });
          }
          if (data.half) {
            appendImage({ file: data.half, type: "half" });
          }

          if (data.full) {
            appendImage({ file: data.full, type: "full" });
          }
          next();
        })}
      >
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>Upload your images</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              name="closeup"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Close Up</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target?.files?.[0])}
                      type="file"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="half"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mid Length</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target?.files?.[0])}
                      type="file"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="full"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Length</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target?.files?.[0])}
                      type="file"
                    />
                  </FormControl>
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
