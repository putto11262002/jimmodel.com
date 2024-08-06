"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { modelImageTypes } from "@/db/schemas/model-images";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { upperFirst } from "lodash";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/api/client";
import useToast from "@/components/toast";

const FormDataSchema = z.object({
  type: z.enum(modelImageTypes),
  file: z
    .any()
    .refine((v) => v instanceof File, "Please select a file")
    .transform((v) => v as File)
    .refine((v) => v.size <= 5_000_000, "File exceeded size limit")
    .refine(
      (v) => ["image/jpg", "image/jpeg", "image/webp"].includes(v.type),
      "Invalid file type",
    ),
});

export default function FileUpload({ modelId }: { modelId: string }) {
  const [open, setOpen] = useState(false);
  const { error, ok } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof FormDataSchema>>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {},
  });

  const { mutate } = useMutation({
    mutationFn: async (data: z.infer<typeof FormDataSchema>) => {
      await client.api.models[":modelId"].images.$post({
        form: { type: data.type, file: data.file },
        param: { modelId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["models", modelId, "images"],
      });
      setOpen(false);
      ok("Model image uploaded successfully");
    },
    onError: (err) => {
      error("Failed to upload model image");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="space-x-2 h-7" size={"sm"}>
          <UploadIcon className="w-3.5 h-3.5 font-semibold " />
          <span className="">Upload</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutate(data))}>
            <DialogHeader>
              <DialogTitle>Upload Model Image</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                name="file"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        type="file"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="type"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Type</FormLabel>
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
                        {modelImageTypes.map((type) => (
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
            <DialogFooter>
              <Button type="submit">Upload</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
