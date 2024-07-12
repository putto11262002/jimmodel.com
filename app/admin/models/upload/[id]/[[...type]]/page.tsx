"use client";
import FileUpload from "../file-upload";
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
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import useToast from "@/components/toast";

const modelImageMenuItems = [
  { label: "All", href: (id: string) => `/admin/models/upload/${id}` },
  {
    label: "Profile",
    href: (id: string) => `/admin/models/upload/${id}/profile`,
  },
  ...modelImageTypes.map((type) => ({
    label: type,
    href: (id: string) => `/admin/models/upload/${id}/${type}`,
  })),
];

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

  const path = usePathname();
  const router = useRouter();
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
    <main
      className="grid
      flex-1
      items-start
      gap-4
      p-4
      sm:px-6
      sm:py-0
      md:gap-4"
    >
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 ">
        <div className="flex items-center">
          <div>
            <Select
              onValueChange={(value) => router.push(value)}
              defaultValue={path}
            >
              <SelectTrigger className="min-w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modelImageMenuItems.map(({ label, href }, index) => (
                  <SelectItem key={index} value={href(id)}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto">
            <FileUpload modelId={id} />
          </div>
        </div>
        {isSuccess ? (
          displayImages.length > 0 ? (
            <ImageGrid images={displayImages} Overlay={ImageActions} />
          ) : (
            <div className="col-span-full flex justify-center py-4">
              <p className="text-muted-foreground	">No images found</p>
            </div>
          )
        ) : (
          <div className="py-4 w-full flex justify-center">
            <Loader className="animate-spin" />
          </div>
        )}
      </div>
    </main>
  );
}

const ImageGrid = ({
  images,
  Overlay,
}: {
  images: ModelImage[];
  Overlay: React.FC<{ image: ModelImage }>;
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image, index) => (
        <AspectRatio key={index} className="relative block group" ratio={1 / 1}>
          <div className="absolute hidden group-hover:flex w-full h-full z-10 inset-0 ">
            <Overlay image={image} />
          </div>
          <Image
            className="object-cover w-full h-full"
            src={`/files/${image.fileId}`}
            alt={"Model"}
            fill
          />
        </AspectRatio>
      ))}
    </div>
  );
};

const ImageActions = ({ image }: { image: ModelImage }) => {
  const queryClient = useQueryClient();
  const { ok, error } = useToast();
  const { mutate: deleteImage } = useMutation({
    mutationFn: async () => {
      await client.api.models[":modelId"].images[":fileId"].$delete({
        param: { modelId: image.modelId, fileId: image.fileId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["models", image.modelId, "images"],
      });
      ok("Image deleted successfully");
    },
    onError: () => {
      error("Failed to delete image");
    },
  });

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
            onClick={() => deleteImage()}
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
