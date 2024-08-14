"use client";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  Select,
  SelectValue,
} from "@/components/ui/select";
import { bookingTypes } from "@/db/schemas";
import { useRouter } from "next/navigation";
import { upperFirst } from "lodash";
import DatetimePicker from "@/components/datetime-picker";
import { useAddBooking, useGetJob } from "@/hooks/queries/job";
import Container from "@/components/container";
import BlockCard from "./_components/blocks-card";
import BookingsCard from "./_components/bookings-card";
import useSession from "@/hooks/use-session";
import permissions from "@/config/permission";
import Loader from "@/components/loader";
import { useBreadcrumbSetter } from "@/components/breadcrumb";

const FormDataSchema = z
  .object({
    jobId: z.string(),
    start: z.date(),

    end: z.date(),
    type: z.enum(bookingTypes),
    notes: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.start.getTime() > data.end.getTime()) {
      ctx.addIssue({
        code: "invalid_date",
        message: "Start date cannot be after end date",
        path: ["start"],
      });
      return z.NEVER;
    }
    return data;
  });

export default function Page({ params: { id } }: { params: { id: string } }) {
  const form = useForm<z.infer<typeof FormDataSchema>>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      jobId: id,
    },
  });
  const session = useSession(permissions.jobs.addBooking);

  const router = useRouter();

  const { mutate } = useAddBooking();

  useBreadcrumbSetter([
    { label: "Jobs", href: "/admin/jobs" },
    { label: id, href: `/admin/jobs/${id}/update` },
    { label: "Bookings", href: `/admin/jobs/${id}/bookings` },
    { label: "New Booking" },
  ]);

  const { data, isSuccess } = useGetJob({
    jobId: id,
    enabled: session.status === "authenticated",
  });

  function onSubmit(data: z.infer<typeof FormDataSchema>) {
    mutate(
      {
        jobId: id,
        data: {
          ...data,
          start: data.start.toISOString(),
          end: data.end.toISOString(),
        },
      },
      {
        onSuccess: () => router.push(`/admin/jobs/${id}/bookings`),
      },
    );
  }
  const start = form.watch("start");
  const end = form.watch("end");

  if (!isSuccess) {
    return (
      <Container max="md">
        <Loader />
      </Container>
    );
  }

  return (
    <Container max="md">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>New Booking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      name="start"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel>Start</FormLabel>
                          <DatetimePicker
                            value={field.value}
                            onChange={field.onChange}
                          />
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
                          <DatetimePicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="type"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {bookingTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {upperFirst(type)}
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
                  <Button>Save</Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
        <div className="col-span-3 grid gap-4">
          <BlockCard start={start} end={end} job={data} />
          <BookingsCard start={start} end={end} jobId={id} />
        </div>
      </div>
    </Container>
  );
}
