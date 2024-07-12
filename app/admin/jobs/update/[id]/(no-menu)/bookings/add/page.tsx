"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
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
import { BookingCreateInputSchema } from "@/lib/validators/job";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  CircleCheck,
  Loader,
  SquareArrowOutUpRight,
} from "lucide-react";
import dayjs from "dayjs";
import { Calendar } from "@/components/ui/calendar";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  Select,
  SelectValue,
} from "@/components/ui/select";
import { BookingCreateInput, bookingTypes } from "@/db/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/api/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import JobStatusBadge from "@/components/job/job-status-badge";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { upperFirst } from "lodash";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import DatetimePicker from "@/components/datetime-picker";

const FormDataSchema = BookingCreateInputSchema;
type FormData = z.infer<typeof FormDataSchema>;

export default function Page({ params: { id } }: { params: { id: string } }) {
  const form = useForm<FormData>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      jobId: id,
    },
  });

  const { data: models } = useQuery({
    queryKey: ["bookings", ""],
    queryFn: async () => {
      const res = await client.api.jobs[":id"].models.$get({ param: { id } });
      const models = await res.json();
      return models;
    },
    enabled: !!id,
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async (data: BookingCreateInput) => {
      await client.api.bookings.$post({ json: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", id, "bookings"] });
      router.push(`/admin/jobs/update/${id}/bookings`);
    },
  });

  const start = form.watch("start");
  const end = form.watch("end");

  const canCheckConflicts = Boolean(
    start &&
      end &&
      new Date(start).getTime() < new Date(end).getTime() &&
      models,
  );

  const { data, isFetching } = useQuery({
    queryKey: ["bookings", "conflicts", start, end],
    queryFn: async () => {
      console.log(start);
      const res = await client.api.bookings.conflicts.$get({
        query: {
          start: new Date(start).toISOString(),
          end: new Date(end).toISOString(),
          models: models?.data?.map((m) => m.id) || [],
        },
      });
      let bookings = await res.json();
      bookings = bookings.filter((bookings) => bookings.jobId !== id);
      return bookings;
    },
    enabled: canCheckConflicts,
  });

  const isConflicting = data && data.length > 0;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutate(data))}>
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
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
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
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
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
      <div className="col-span-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Conflicts
              {canCheckConflicts && (
                <Badge
                  variant={"outline"}
                  className={cn(
                    "ml-4",
                    !isConflicting && "bg-green-100 text-green-800",
                    isConflicting && "bg-red-100 text-red-800",
                    isFetching && "bg-yellow-100 text-yellow-800",
                  )}
                >
                  {isFetching
                    ? "Calulating"
                    : data && data.length
                      ? "Dangerous"
                      : "OK"}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              List of job bookings that contains the same models and falls in
              the selected date range
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching ? (
                  <TableRow className="">
                    <TableCell colSpan={6} className="">
                      {/* <Skeleton className="w-full h-10" /> */}

                      <p className="flex items-center gap-2 justify-center py-4">
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>Loading conflicts...</span>
                      </p>
                    </TableCell>
                  </TableRow>
                ) : data && data?.length > 0 ? (
                  data?.map((conflict) => (
                    <TableRow key={conflict.id}>
                      <TableCell>{conflict.job.name}</TableCell>
                      <TableCell>
                        <JobStatusBadge status={conflict.job.status} />
                      </TableCell>
                      <TableCell>
                        {dayjs(conflict.start).format("DD MMM YY HH:mm")}
                      </TableCell>
                      <TableCell>
                        {dayjs(conflict.end).format("DD MMM YY HH:mm")}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/jobs/update/${conflict.jobId}`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <Button size={"icon"} variant={"ghost"}>
                            <SquareArrowOutUpRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      <p className="flex items-center justify-center gap-2">
                        <CircleCheck className="h-4 w-4 text-green-800" />{" "}
                        <span>No Conflicting Bookings</span>
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
