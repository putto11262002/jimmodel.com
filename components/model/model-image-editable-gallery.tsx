"use client";
import {
  removeModelImageAction,
  updateModelImageTypeAction,
} from "@/actions/model";
import GridImageGallery from "@/components/image-grid-gallery";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import routes from "@/config/routes";

import { ModelImage } from "@/lib/domains";

import { MoreHorizontal } from "lucide-react";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import useToast from "../toast";
import { objToFormData } from "@/lib/utils/form-data";

export default function ModelImageEditableGallery({
  images,
}: {
  images: ModelImage[];
}) {
  const [removeModelImageState, removeModelImage, removeModelImagePending] =
    useFormState(removeModelImageAction, { status: "idle" });
  const [
    updateModelImageTypeState,
    updateModelImageType,
    updateModelImageTypePending,
  ] = useFormState(updateModelImageTypeAction, { status: "idle" });
  const { ok, error } = useToast();

  useEffect(() => {
    if (
      removeModelImageState.status === "success" &&
      removeModelImageState.message
    ) {
      ok(removeModelImageState.message);
    }
    if (
      removeModelImageState.status === "error" &&
      removeModelImageState.message
    ) {
      error(removeModelImageState.message);
    }
  }, [removeModelImageState]);

  useEffect(() => {
    if (
      updateModelImageTypeState.status === "success" &&
      updateModelImageTypeState.message
    ) {
      ok(updateModelImageTypeState.message);
    }
    if (
      updateModelImageTypeState.status === "error" &&
      updateModelImageTypeState.message
    ) {
      error(updateModelImageTypeState.message);
    }
  }, [updateModelImageTypeState]);

  return (
    <GridImageGallery
      columns={3}
      rounded={"rounded-md"}
      images={modelImageToGalleryImage(images)}
      overlay={({ index }) => (
        <Overlay
          removeModelImage={removeModelImage}
          updateModelImageType={updateModelImageType}
          image={images[index]}
        />
      )}
    />
  );
}

const modelImageToGalleryImage = (images: ModelImage[]) => {
  return images.map((image) => ({
    src: routes.getFiles(image.fileId),
    width: image.width,
    height: image.height,
    fileId: image.fileId,
  }));
};

const Overlay = ({
  image,
  removeModelImage,
  updateModelImageType,
}: {
  image: ModelImage;
  updateModelImageType: (formData: FormData) => void;
  removeModelImage: (formData: FormData) => void;
}) => {
  return (
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
              removeModelImage(
                objToFormData({ id: image.modelId, fileId: image.fileId })
              )
            }
          >
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem
          // onClick={() => setIndex(index)}
          >
            View
          </DropdownMenuItem>

          <a href={routes.getFiles(image.fileId)} download>
            <DropdownMenuItem>Download</DropdownMenuItem>
          </a>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Change To</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() =>
                    updateModelImageType(
                      objToFormData({
                        id: image.modelId,
                        fileId: image.fileId,
                        type: "book",
                      })
                    )
                  }
                >
                  Book
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    updateModelImageType(
                      objToFormData({
                        id: image.modelId,
                        fileId: image.fileId,
                        type: "polaroid",
                      })
                    )
                  }
                >
                  Polaroid
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    updateModelImageType(
                      objToFormData({
                        id: image.modelId,
                        fileId: image.fileId,
                        type: "composite",
                      })
                    )
                  }
                >
                  Composite
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
