import ApplicationImageGallery from "@/components/application/application-image-gallery";
import ApplicationImageUploadDialog from "@/components/application/dialogs/application-image-upload-dialog";
import { Card } from "@/components/card";
import IconButton from "@/components/icon-button";
import { getApplicationImagesByToken } from "@/loaders/application";
import { Upload } from "lucide-react";

export default async function Page() {
  const images = await getApplicationImagesByToken();
  return (
    <div className="grid gap-4">
      <div>
        <ApplicationImageUploadDialog
          trigger={
            <IconButton
              size="sm"
              icon={<Upload className="icon-sm" />}
              text="Image"
            />
          }
        />
      </div>

      {images.length > 0 ? (
        <ApplicationImageGallery images={images} />
      ) : (
        <div className="text-sm text-muted-foreground flex justify-center items-center h-24">
          No image added
        </div>
      )}
    </div>
  );
}
