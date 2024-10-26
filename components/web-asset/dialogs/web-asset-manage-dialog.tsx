"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useState } from "react";
import WebAssetUpdateFrom from "../forms/web-asset-update-form";
import PublishWebAssetForm from "../forms/publish-web-asset-form";
import { Button } from "@/components/ui/button";
import UnpublishWebAssetForm from "../forms/unpublish-web-asset-form";
import { WebAsset } from "@/lib/domains";
import WebAssetDeleteForm from "../forms/web-asset-delete-form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

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
        <Tabs className="">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit Metadata</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="pt-4">
            <WebAssetUpdateFrom
              webAsset={webAsset}
              trigger={
                <div>
                  <Button>Save</Button>
                </div>
              }
            />
          </TabsContent>
          <TabsContent value="actions" className="grid gap-4 pt-4">
            {!webAsset.published && (
              <PublishWebAssetForm
                id={webAsset.id}
                trigger={
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Display web asset on the public site.
                    </p>
                    <Button variant="success">Publish</Button>
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
                    <Button variant="warning">Unpublish</Button>
                  </div>
                }
              />
            )}
            <WebAssetDeleteForm
              id={webAsset.id}
              done={() => setOpen(false)}
              trigger={
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Permanently delete web asset.
                  </p>
                  <Button variant="destructive">Delete</Button>
                </div>
              }
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
