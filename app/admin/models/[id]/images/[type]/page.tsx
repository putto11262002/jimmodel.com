import { Card } from "@/components/card";
import IconButton from "@/components/icon-button";
import ModelImageFormDialog from "@/components/model/dialogs/model-image-form-dialog";
import ModelImageEditableGallery from "@/components/model/model-image-editable-gallery";
import { MODEL_IMAGE_TYPES } from "@/db/constants";
import { getModelImages } from "@/loaders/model";
import { PlusCircle } from "lucide-react";
import { auth } from "@/config";
import permissions from "@/config/permission";
import ModelImageTypeSelect from "./_components/image-type-select";
import { z } from "zod";
import { ignoreError } from "@/lib/utils/validator";

const typeValidator = ignoreError(z.enum(MODEL_IMAGE_TYPES));

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; type: string }>;
}) {
  await auth({ permission: permissions.models.getModelImagesById });
  const { id, type } = await params;
  const imageType = typeValidator.parse(type);

  const images = await getModelImages(id, { type: imageType });

  return (
    <div className="grid gap-4">
      <h2 className="font-semibold">Model Images</h2>
      <div className="flex items-cetner justify-between">
        <div className="w-28">
          <ModelImageTypeSelect modelId={id} defaultValue={imageType} />
        </div>
        <ModelImageFormDialog
          trigger={
            <IconButton
              size="sm"
              icon={<PlusCircle className="w-3.5 h-3.5" />}
              text="Image"
            />
          }
          modelId={id}
        />
      </div>
      <Card>
        <div className="grid gap-4">
          <div>
            {images.length > 0 ? (
              <ModelImageEditableGallery images={images} />
            ) : (
              <p className="text-center text-muted-foreground text-sm py-16">
                No images found
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
