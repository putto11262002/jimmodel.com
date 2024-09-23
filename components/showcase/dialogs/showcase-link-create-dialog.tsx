"use client";
import { addShowcaseLinkAction } from "@/actions/showcase";
import Alert from "@/components/alert";
import AsyncButton from "@/components/shared/buttons/async-button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Showcase } from "@/lib/domains";
import { ShowcaseLinkCreateInputSchema } from "@/lib/usecases/showcase/inputs";
import { objToFormData } from "@/lib/utils/form-data";
import { videoIframeProcessor } from "@/lib/video-link";
import { useActionState, useEffect, useRef, useState } from "react";

export default function ShowcaseLinkCreateDialog({
  showcase,
  trigger,
}: {
  showcase: Showcase;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState<string | undefined>(undefined);
  const [iframe, setIframe] = useState<string | undefined>(undefined);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [state, action, pending] = useActionState(addShowcaseLinkAction, {
    status: "idle",
  });
  useEffect(() => {
    if (url) {
      const validation = ShowcaseLinkCreateInputSchema.safeParse({ url });
      if (!validation.success) {
        setUrlError(validation.error.errors[0].message);
        setIframe(undefined);
        return;
      }
      const videoIframeInfo = videoIframeProcessor.process(validation.data.url);
      if (!videoIframeInfo) {
        setUrlError("URL is not supported");
        setIframe(undefined);
        return;
      }
      const _url = new URL(videoIframeInfo.iframeSrc);
      _url.searchParams.set(
        "height",
        iframeRef.current?.clientHeight.toString() ?? "200"
      );
      _url.searchParams.set(
        "width",
        iframeRef.current?.clientWidth.toString() ?? "300"
      );
      setIframe(_url.toString());
      setUrlError(undefined);
    }
  }, [url]);

  useEffect(() => {
    if (state.status === "success") {
      setUrl("");
      setIframe(undefined);
      setOpen(false);
    }
  }, [state]);

  const onAddLink = () => {
    action(objToFormData({ id: showcase.id, url }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Link</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {urlError && <Alert variant="error">{urlError}</Alert>}
          <Input value={url} onChange={(e) => setUrl(e.target.value)} />
          <AspectRatio
            ratio={3 / 2}
            className="w-full rounded-lg bg-muted border overflow-hidden relative"
            ref={iframeRef}
          >
            {iframe ? (
              <iframe
                height={iframeRef.current?.clientHeight}
                width={iframeRef.current?.clientWidth}
                className="w-full h-full absolute top-0 left-0 object-cover"
                src={iframe}
              />
            ) : (
              <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-sm text-muted-foreground">
                Video preview
              </div>
            )}
          </AspectRatio>
          <div className="flex justify-end">
            {url && iframe && (
              <AsyncButton pending={pending} onClick={() => onAddLink()}>
                Add Link
              </AsyncButton>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
