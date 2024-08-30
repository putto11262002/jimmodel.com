"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { genders } from "@/lib/types/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { upperFirst } from "lodash";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  directBookingQueries,
  inTownQueries,
  localQueries,
  PathParamsSchema,
  SearchParamsSchema,
} from "../_lib.ts/schemas";
import { modelCategories } from "@/lib/constants/model";

const FilterSchema = z.object({
  category: z.enum(modelCategories).optional().nullable(),
  local: z.enum(localQueries).optional().default("all"),
  directBooking: z.enum(directBookingQueries).optional().default("all"),
  inTown: z.enum(inTownQueries).optional().default("all"),
});

export default function ModelFilterDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const params = useParams<{ gender: string }>();
  const router = useRouter();
  const parsedSearchParams = SearchParamsSchema.parse({
    local: searchParams.get("local"),
    directBooking: searchParams.get("directBooking"),
    inTown: searchParams.get("inTown"),
  });
  const parsedPathParams = PathParamsSchema.parse(params);
  const form = useForm<z.infer<typeof FilterSchema>>({
    resolver: zodResolver(FilterSchema),
    defaultValues: {
      category: parsedPathParams.category,
      local: parsedSearchParams.local,
      directBooking: parsedSearchParams.directBooking,
      inTown: parsedSearchParams.inTown,
    },
  });
  const [open, setOpen] = useState(false);
  const local = form.watch("local");
  const inTown = form.watch("inTown");
  const onSubmit = (data: z.infer<typeof FilterSchema>) => {
    const mutatbleSearchParams = new URLSearchParams(searchParams.toString());
    mutatbleSearchParams.set("local", data.local);
    if (data.local === "non-local") {
      mutatbleSearchParams.set("inTown", data.inTown);
    } else {
      mutatbleSearchParams.delete("inTown");
    }
    if (data.inTown === "out town") {
      mutatbleSearchParams.set("directBooking", data.directBooking);
    } else {
      mutatbleSearchParams.delete("directBooking");
    }
    mutatbleSearchParams.set("page", "1");
    router.push(
      `/models/${data.category || parsedPathParams.category}?${mutatbleSearchParams.toString()}`,
    );
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Filter</DialogTitle>
            </DialogHeader>
            <div className="py-4 grid gap-4">
              <FormField
                name="category"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {modelCategories.map((category, index) => (
                          <SelectItem key={index} value={category}>
                            {upperFirst(category)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                name="local"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {localQueries.map((local, index) => (
                          <SelectItem key={index} value={local}>
                            {upperFirst(local)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {local !== "local" && (
                <FormField
                  name="inTown"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>In Town</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {inTownQueries.map((inTown, index) => (
                            <SelectItem key={index} value={inTown}>
                              {upperFirst(inTown)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}

              {local !== "local" && (
                <FormField
                  name="directBooking"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Direct Booking</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {directBookingQueries.map((directBooking, index) => (
                            <SelectItem key={index} value={directBooking}>
                              {upperFirst(directBooking)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}
            </div>
            <DialogFooter>
              <Button>Apply</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
