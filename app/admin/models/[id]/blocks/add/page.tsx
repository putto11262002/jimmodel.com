"use client";
import { BreakcrumbSetter, useBreadcrumbSetter } from "@/components/breadcrumb";
import Container from "@/components/container";
import DatetimePicker from "@/components/datetime-picker";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateModelBlock } from "@/hooks/queries/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const AddModelBlockFormSchema = z
  .object({
    start: z.date(),
    end: z.date(),
    reason: z.string().min(1, "reason of block is required"),
  })
  .refine((data) => data.start.getTime() < data.end.getTime(), {
    message: "End date must be after start date",
    path: ["end"],
  });

export default function Page({ params: { id } }: { params: { id: string } }) {
  useBreadcrumbSetter([
    { label: "Models", href: "/admin/models" },
    { label: id, href: `/admin/models/${id}/update` },
    { label: "Blocks", href: `/admin/models/${id}/blocks` },
    { label: "New Block" },
  ]);
  const router = useRouter();
  const { mutate: block } = useCreateModelBlock();
  const form = useForm<z.infer<typeof AddModelBlockFormSchema>>({
    resolver: zodResolver(AddModelBlockFormSchema),
    defaultValues: { start: new Date(), end: new Date() },
  });

  return (
    <Container max="md" className="grid gap-4">
      {/* <div className="flex gap-4 items-center"> */}
      {/*   <Button onClick={() => router.back()} variant={"outline"} size={"icon"}> */}
      {/*     <ChevronLeft className="w-4 h-4" /> */}
      {/*   </Button> */}
      {/* </div> */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((formData) =>
            block(
              {
                modelId: id,
                input: {
                  ...formData,
                  start: formData.start.toISOString(),
                  end: formData.end.toISOString(),
                },
              },
              { onSuccess: () => router.push(`/admin/models/${id}/blocks`) },
            ),
          )}
          className=""
        >
          <Card>
            <CardHeader>
              <CardTitle>Add Block</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <FormField
                name="start"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Start</FormLabel>
                    <FormControl>
                      <DatetimePicker
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="end"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>End</FormLabel>
                    <FormControl>
                      <DatetimePicker
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="reason"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="py-4 border-t">
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </Container>
  );
}
