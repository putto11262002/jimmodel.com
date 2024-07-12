"use client"
import { UseFormReturn, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Job } from "@/db/schemas";
import { z } from "zod";
import { JobUpdateInputSchema } from "@/lib/validators/job";

export default function ClientForm({ form }: { form: UseFormReturn<z.infer<typeof JobUpdateInputSchema>> }) {


  return (
    
        <Card>
          <CardHeader>
            <CardTitle>Client Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
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
            </div>

          </CardContent>
        </Card>
    
  )
}