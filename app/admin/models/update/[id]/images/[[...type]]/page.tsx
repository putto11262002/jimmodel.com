"use client";
import { ModelImage, modelImageTypes } from "@/db/schemas/model-images";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Loader, Trash, UserCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/api/client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import useToast from "@/components/toast";
import ImageSkeleton from "./_components/image-skeleton";
import { useRemoveModelImage } from "@/hooks/queries/model";
import ImageGrid from "@/components/model/image-grid";

export default function Page() {
  const params = useParams<{ id: string; type?: string[] }>();

  const type = params?.type ? params.type[0] : undefined;

  const id = params.id;

  const { data: images, isSuccess } = useQuery({
    queryKey: ["models", id, "images"],
    queryFn: async () => {
      const res = await client.api.models[":modelId"].images.$get({
        param: { modelId: id },
      });
      const images = await res.json();
      return images;
    },
  });

  const displayImages = useMemo(
    () =>
      images
        ? images.filter((image) =>
            type
              ? type === "profile"
                ? image.isProfile
                : image.type === type
              : true,
          )
        : [],
    [images, type],
  );

  return (
    <>
      {isSuccess ? (
        <ImageGrid images={displayImages} Overlay={ImageActions} />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <ImageSkeleton />
          <ImageSkeleton />
          <ImageSkeleton />
          <ImageSkeleton />
          <ImageSkeleton />
        </div>
      )}
    </>
  );
}

const ImageActions = ({ image }: { image: ModelImage }) => {
  const queryClient = useQueryClient();
  const { ok, error } = useToast();
  const { mutate: deleteImage } = useRemoveModelImage();
  const { mutate: setProfile } = useMutation({
    mutationFn: async () => {
      await client.api.models[":modelId"].images.profile.$post({
        json: { fileId: image.fileId },
        param: { modelId: image.modelId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["models"],
      });
      ok("Profile image set successfully");
    },
    onError: () => {
      error("Failed to set as profile");
    },
  });

  return (
    <div className="flex justify-center items-center gap-4 w-full h-full bg-gray-800/50">
      <Tooltip>
        <TooltipTrigger>
          <Button
            className="rounded-full"
            variant={"outline"}
            size={"icon"}
            onClick={() =>
              deleteImage({ modelId: image.modelId, fileId: image.fileId })
            }
          >
            <Trash className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete</p>
        </TooltipContent>
      </Tooltip>
      {!image.isProfile && (
        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={() => setProfile()}
              className="rounded-full"
              variant={"outline"}
              size={"icon"}
            >
              <UserCircle className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Set as Profile</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
