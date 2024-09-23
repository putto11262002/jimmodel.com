"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import WebAssetCreateForm from "../forms/web-asset-create-form";
import { useState } from "react";
import WebAssetUpdateFrom from "../forms/web-asset-update-form";
import PublishWebAssetForm from "../forms/publish-web-asset-form";
import { Button } from "@/components/ui/button";
import UnpublishWebAssetForm from "../forms/unpublish-web-asset-form";
import { WebAsset } from "@/lib/domains";
import WebAssetDeleteForm from "../forms/web-asset-delete-form";

export default function WebAssetManageDialog({
  trigger,
  webAsset,
}: {
  trigger: React.ReactNode;
  webAsset: WebAsset;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Web Asset</DialogTitle>
        </DialogHeader>
        <div className="py-4 grid gap-4">
          <div className="p-4 rounded-md ">
            <WebAssetUpdateFrom
              webAsset={webAsset}
              trigger={
                <div>
                  <Button size="sm">Save</Button>
                </div>
              }
            />
          </div>
          <div className="p-4 rounded-md grid gap-4">
            {!webAsset.published && (
              <PublishWebAssetForm
                id={webAsset.id}
                trigger={
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Display web asset on the public site.
                    </p>
                    <Button size="sm">Publish</Button>
                  </div>
                }
              />
            )}
            {webAsset.published && (
              <UnpublishWebAssetForm
                id={webAsset.id}
                trigger={
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Hide web asset on the public site.
                    </p>
                    <Button size="sm">Publish</Button>
                  </div>
                }
              />
            )}
            <WebAssetDeleteForm
              id={webAsset.id}
              trigger={
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Permanently delete web asset.
                  </p>
                  <Button size="sm" variant="destructive">
                    Delete
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
