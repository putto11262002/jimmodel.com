import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { placeholderImage } from "@/config/image";
import routes from "@/config/routes";
import { Showcase } from "@/lib/types/showcase";
import { imageValidator } from "@/lib/validators/file";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUpdateCoverImage } from "@/hooks/queries/showcase";

const FormSchema = z.object({
  file: imageValidator(),
});

export default function CoverImageCard({ showcase }: { showcase: Showcase }) {
  const { mutate } = useUpdateCoverImage();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cover Image</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 ">
        <AspectRatio className="" ratio={3 / 2}>
          <Image
            className="object-cover rounded"
            fill
            src={
              showcase.coverImageId
                ? routes.getFiles(showcase.coverImageId)
                : placeholderImage
            }
            alt={showcase.title}
          />
        </AspectRatio>
        <div className="col-span-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) =>
                mutate({ id: showcase.id, input: data }),
              )}
              className="grid gap-4"
            >
              <FormField
                name="file"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Cover Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => field.onChange(e.target?.files?.[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex">
                <Button size="sm" className="ml-auto h-7" type="submit">
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
