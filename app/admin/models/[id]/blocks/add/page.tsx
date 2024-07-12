"use client";
import DatetimePicker from "@/components/datetime-picker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useBlockModel } from "@/hooks/queries/model";
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

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { mutate: block } = useBlockModel();
  const form = useForm<z.infer<typeof AddModelBlockFormSchema>>({
    resolver: zodResolver(AddModelBlockFormSchema),
  });

  return (
    <main className="">
      <div className="max-w-3xl mx-auto grid gap-4">
        <div className="flex gap-4 items-center">
          <Button
            onClick={() => router.back()}
            variant={"outline"}
            size={"icon"}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-2xl font-semibold">New Block</h2>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((formData) =>
              block({
                modelId: id,
                input: {
                  ...formData,
                  start: formData.start.toISOString(),
                  end: formData.end.toISOString(),
                },
              }),
            )}
            className="grid gap-4"
          >
            <FormField
              name="start"
              control={form.control}
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
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
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button>Save</Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
