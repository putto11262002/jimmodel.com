"use client";
import Container from "@/components/container";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import permissions from "@/config/permission";
import { useGetWebAsset } from "@/hooks/queries/web-asset";
import useSession from "@/hooks/use-session";
import { webAssetTags } from "@/lib/constants/web-asset";
import { WebAsset, WebAssetUpdateInput } from "@/lib/types/web-asset";
import { stringToNumber } from "@/lib/utils/validator";
import { WebAssetUpdateInputSchema } from "@/lib/validators/web-asset";
import { zodResolver } from "@hookform/resolvers/zod";
import { upperFirst } from "lodash";
import { useForm } from "react-hook-form";
import { z } from "zod";
export default function Page({ params: { id } }: { params: { id: string } }) {
  const session = useSession(permissions.weebAssets.getWebAsset);
  const { isSuccess, data } = useGetWebAsset({
    id,
    enabled: session.status === "authenticated",
  });
  if (!isSuccess) {
    return (
      <Container max="md">
        <Loader />
      </Container>
    );
  }
  return (
    <Container max="md">
      <PageContent webAsset={data} />
    </Container>
  );
}

const FormSchema = WebAssetUpdateInputSchema;

function PageContent({ webAsset }: { webAsset: WebAsset }) {
  const form = useForm<WebAssetUpdateInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: webAsset,
  });

  return (
    <Form {...form}>
      <form>
        <Card>
          <CardHeader>
            <CardTitle>Update Web Asset Metadata</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {webAssetTags.map((tag, index) => (
                        <SelectItem key={index} value={tag}>
                          {upperFirst(tag)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alt"
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
          </CardContent>
          <CardFooter>
            <Button>Save</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
