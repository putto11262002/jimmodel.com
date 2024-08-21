"use client";
import { modelImageTypes } from "@/db/schemas/model-images";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import ImageSkeleton from "./_components/image-skeleton";
import { useGetModelImages, useRemoveModelImage } from "@/hooks/queries/model";
import useSession from "@/hooks/use-session";
import permissions from "@/config/permission";
import ImageGridGallery from "@/components/image-grid-gallery";
import routes from "@/config/routes";
import { useGridImageGalleryContext } from "@/components/image-grid-gallery";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loader from "@/components/loader";

export default function Page({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "all";
  const session = useSession(permissions.models.getModelImagesById);

  const { data: images, isSuccess } = useGetModelImages({
    modelId: params.id,
    enabled: session.status === "authenticated",
  });
  const { setIndex } = useGridImageGalleryContext();

  const { mutate: deleteImage } = useRemoveModelImage();

  const displayImages = useMemo(
    () =>
      images
        ? images
            .filter((image) => {
              if (modelImageTypes.includes(type as any)) {
                return image.type === type;
              } else {
                return true;
              }
            })
            .map((image, index) => ({
              src: routes.getFiles(image.file.id),
              width: image.file.width ?? 0,
              height: image.file.height ?? 0,
              fileId: image.fileId,
            }))
        : [],
    [images, type],
  );

  return (
    <>
      {isSuccess ? (
        displayImages.length > 0 ? (
          <ImageGridGallery
            Overlay={({ index }) => (
              <div className="flex justify-center items-center gap-4 absolute top-1 right-1 z-20">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      className="rounded-full w-6 h-6"
                      variant={"outline"}
                      size={"icon"}
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        deleteImage({
                          modelId: params.id,
                          fileId: displayImages[index].fileId,
                        })
                      }
                    >
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIndex(index)}>
                      View
                    </DropdownMenuItem>
                    <a href={displayImages[index].src} download>
                      <DropdownMenuItem>Download</DropdownMenuItem>
                    </a>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            images={displayImages}
          />
        ) : (
          <div className="py-8 text-center text-muted-foreground text-sm">
            No images found
          </div>
        )
      ) : (
        <div className="py-8">
          <Loader />
        </div>
      )}
    </>
  );
}
