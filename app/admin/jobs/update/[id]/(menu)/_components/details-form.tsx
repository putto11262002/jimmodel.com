"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { JobUpdateInputSchema } from "@/lib/validators/job";
import { z } from "zod";

export default function DetailsForm({
  form,
}: {
  form: UseFormReturn<z.infer<typeof JobUpdateInputSchema>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
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
        </div>
      </CardContent>
    </Card>
  );
}
