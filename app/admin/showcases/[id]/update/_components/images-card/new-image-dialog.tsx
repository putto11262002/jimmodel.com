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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { imageValidator } from "@/lib/validators/file";
import { zodResolver } from "@hookform/resolvers/zod";
import { Close } from "@radix-ui/react-dialog";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormData = z.object({
  file: imageValidator(),
});

export default function NewImageDialog({
  onSubmit,
}: {
  onSubmit: (data: z.infer<typeof FormData>) => void;
}) {
  const form = useForm<z.infer<typeof FormData>>({
    resolver: zodResolver(FormData),
  });
  return (
    <Dialog>
      <DialogTrigger>
        <Button size={"xs"}>
          <Upload className="w-3.5 h-3.5" />
          <span className="ml-2">Image</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>New Image</DialogTitle>
            </DialogHeader>
            <div className="py-4 grid gap-4">
              <FormField
                name="file"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
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
            </div>
            <DialogFooter>
              <Close>
                <Button type="submit">Upload</Button>
              </Close>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
