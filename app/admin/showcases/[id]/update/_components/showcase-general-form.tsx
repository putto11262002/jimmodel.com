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
import { Textarea } from "@/components/ui/textarea";
import { Showcase, ShowcaseUpdateInput } from "@/lib/types/showcase";
import { ShowcaseUpdateInputSchema } from "@/lib/validators/showcase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUpdateShowcase } from "@/hooks/queries/showcase";

export default function ShowcaseGeneralForm({
  showcase,
}: {
  showcase: Showcase;
}) {
  const form = useForm<ShowcaseUpdateInput>({
    defaultValues: showcase,
    resolver: zodResolver(ShowcaseUpdateInputSchema),
  });
  const { isPending, mutate } = useUpdateShowcase();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          mutate({ id: showcase.id, input: data }),
        )}
        className="grid gap-4"
      >
        <Card>
          <CardHeader>
            <CardTitle>General </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              disabled={isPending}
              size={"xs"}
              type="submit"
              className="ml-auto"
            >
              Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
