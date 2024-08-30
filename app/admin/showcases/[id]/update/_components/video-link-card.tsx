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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import client from "@/lib/api/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Showcase } from "@/lib/types/showcase";
import { useAddLink, useRemoveLink } from "@/hooks/queries/showcase";
import { X } from "lucide-react";

const FormSchema = z.object({
  url: z.string().url(),
});
export default function VideoLinkCard({ showcase }: { showcase: Showcase }) {
  const { mutate } = useRemoveLink();
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Videos</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <NewVideoLinkForm showcase={showcase} />
        {showcase.videoLinks && showcase.videoLinks.length > 0 ? (
          <ul className="grid gap-4 w-full min-w-0">
            {showcase.videoLinks.map((videoLink, index) => (
              <li
                key={index}
                className="min-w-0 text-sm rounded-md hover:underline text-muted-foreground py-2 px-3 border flex items-center"
              >
                <a
                  className="grow truncate"
                  href={videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {videoLink}
                </a>
                <div>
                  <Button
                    onClick={() => mutate({ id: showcase.id, url: videoLink })}
                    className="w-5 h-5"
                    variant={"ghost"}
                    size={"icon"}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-4 text-sm text-muted-foreground text-center">
            No video added
          </div>
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

function NewVideoLinkForm({ showcase }: { showcase: Showcase }) {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: { url: "" },
  });

  const [videolink, setVideoLink] = useState<{
    ok: boolean;
    iframeSrc: string;
    originalUrl: string;
  } | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ url }: { url: string }) => {
      const res = await client.api["video-links"].process.$post({
        json: { url },
      });
      return res.json();
    },
  });

  const { mutate: addLink, isPending: isPendingAddLink } = useAddLink();

  const link = form.watch("url");
  return (
    <div className="grid gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(({ url }) => {
            mutate(
              { url },
              {
                onSuccess: ({ iframeSrc, ok }, { url }) => {
                  if (ok) {
                    setVideoLink({ ok: true, iframeSrc, originalUrl: url });
                  } else {
                    setVideoLink({
                      ok: false,
                      iframeSrc: "",
                      originalUrl: url,
                    });
                  }
                },
              },
            );
          })}
          className="flex items-start gap-2"
        >
          <FormField
            name="url"
            control={form.control}
            render={({ field }) => (
              <FormItem className="grow">
                <FormControl>
                  <Input className="h-7" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {videolink && videolink.ok && videolink.originalUrl === link ? (
            <Button
              onClick={() =>
                addLink(
                  { id: showcase.id, url: videolink.originalUrl },
                  {
                    onSuccess: () => {
                      form.reset({});
                      setVideoLink(null);
                    },
                  },
                )
              }
              disabled={isPendingAddLink}
              type="button"
              className=""
              size={"xs"}
            >
              Add
            </Button>
          ) : (
            <Button
              disabled={isPending}
              variant={"outline"}
              className=""
              size={"xs"}
            >
              Validate
            </Button>
          )}
        </form>
      </Form>
      {videolink ? (
        videolink.ok ? (
          <AspectRatio ratio={3 / 2}>
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              className="w-full h-full"
              src={videolink.iframeSrc}
            />
          </AspectRatio>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
            Unsupport video source
          </div>
        )
      ) : null}
    </div>
  );
}
