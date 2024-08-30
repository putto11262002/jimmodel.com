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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { useCreateWebAsset } from "@/hooks/queries/web-asset";
import { webAssetTags } from "@/lib/constants/web-asset";
import { WebAssetCreateInput } from "@/lib/types/web-asset";
import { WebAssetCreateInputSchema } from "@/lib/validators/web-asset";
import { zodResolver } from "@hookform/resolvers/zod";
import { Close } from "@radix-ui/react-dialog";
import { upperFirst } from "lodash";
import { PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";

export default function CreateWebAssetDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const form = useForm<WebAssetCreateInput>({
    resolver: zodResolver(WebAssetCreateInputSchema),
  });
  const { mutate } = useCreateWebAsset();
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="" size="xs">
            <PlusCircle className="w-3.5 h-3.5" />{" "}
            <span className="ml-2">Web Asset</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutate({ input: data }))}>
            <DialogHeader>
              <DialogTitle>New Web Asset</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                name="file"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
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
              <FormField
                name="alt"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alt</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="tag"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {webAssetTags.map((tag, index) => (
                          <SelectItem value={tag} key={index}>
                            {upperFirst(tag)}
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
              <Close>
                <Button>Create</Button>
              </Close>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
