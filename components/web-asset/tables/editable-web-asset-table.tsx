import { Badge } from "@/components/ui/badge";
import routes from "@/config/routes";
import { WebAsset } from "@/lib/domains";
import { Edit } from "lucide-react";
import Image from "next/image";
import WebAssetManageDialog from "../dialogs/web-asset-manage-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import IconButton from "@/components/icon-button";
import { WEB_ASSET_TAG_LABELS } from "@/db/constants";

export default function EditableWebAssetTable({
  webAssets,
}: {
  webAssets: WebAsset[];
}) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {webAssets.map((webasset, index) => (
          <div
            className="rounded-lg border overflow-hidden flex flex-col"
            key={index}
          >
            <AspectRatio className="w-full" ratio={3 / 2}>
              {webasset.published && (
                <Badge
                  variant="success"
                  className="top-2 right-2 z-10 absolute"
                >
                  Published
                </Badge>
              )}
              <Image
                className="object-cover"
                fill
                src={routes.files.get(webasset.id)}
                alt={webasset.alt}
              />
            </AspectRatio>
            <div className="px-4 py-4 grid gap-2 grid-rows-[auto_1fr_auto] grow">
              <div className="flex items-center flex-wrap gap-2">
                {webasset.tag.map((tag, index) => (
                  <Badge variant="outline" key={index}>
                    {WEB_ASSET_TAG_LABELS[tag]}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-end">
                <WebAssetManageDialog
                  webAsset={webasset}
                  trigger={
                    <IconButton
                      size="sm"
                      icon={<Edit className="icon-sm" />}
                      text="Edit"
                    />
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
