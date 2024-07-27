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
import { useFormContext } from "../_components/form-context";
import { ApplicationCreateInputSchema } from "@/lib/validators/application";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formDataSchema = ApplicationCreateInputSchema.pick({
  email: true,
  phoneNumber: true,
  whatsapp: true,
  lineId: true,
  instagram: true,
  facebook: true,
  wechat: true,
}).and(z.object({}));

export default function ContactForm() {
  const form = useForm<z.infer<typeof formDataSchema>>({
    resolver: zodResolver(formDataSchema),
  });

  const { setApplication, next } = useFormContext();

  return (
    <Form {...form}>
      {/* <div className="col-span-full mt-4"> */}
      {/*   <h3 className="text-sm font-semibold">Primary Contact</h3> */}
      {/* </div> */}
      <form
        className=""
        onSubmit={form.handleSubmit((data) => {
          setApplication((prev) => ({ ...prev, ...data }));
          next();
        })}
      >
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Model contact information</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="phoneNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <div className="col-span-full mt-4"> */}
            {/*   <h3 className="text-sm font-semibold">Additional Contacts</h3> */}
            {/* </div> */}
            <FormField
              name="lineId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Line ID (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="whatsapp"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="wechat"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WeChat (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <div className="col-span-full mt-4"> */}
            {/*   <h3 className="text-sm font-semibold">Social Medias</h3> */}
            {/* </div> */}
            <FormField
              name="facebook"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="instagram"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="py-4 border-t">
            <Button className="ml-auto" type="submit">
              Next
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
