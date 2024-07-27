"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { JobUpdateInputSchema } from "@/lib/validators/job";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetJob, useUpdateJob } from "@/hooks/queries/job";
import JobFormSkeleton from "./job-form-skeleton";
import { Job } from "@/lib/types/job";

export default function JobForm({ jobId }: { jobId: string }) {
  const { data, isSuccess } = useGetJob({ jobId });
  if (!isSuccess) {
    return <JobFormSkeleton />;
  }
  return <_JobForm job={data} />;
}

const _JobForm = ({ job }: { job: Job }) => {
  const { mutate } = useUpdateJob();
  const form = useForm<z.infer<typeof JobUpdateInputSchema>>({
    resolver: zodResolver(JobUpdateInputSchema),
    defaultValues: job,
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((formData) =>
          mutate({ jobId: job.id, formData }),
        )}
      >
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
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
                name="client"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="clientAddress"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="personInCharge"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Person in Charge</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="mediaReleased"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media Release</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="territoriesReleased"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Territories Released</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="workingHour"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Working Hour</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="venueOfShoot"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue of Shoot</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="feeAsAgreed"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fee as Agreed</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="overtimePerHour"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overtime per Hour</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="cancellationFee"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cancellation Fee</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="contractDetails"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Save</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
