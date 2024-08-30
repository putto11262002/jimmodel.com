import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { imageDim } from "@/config/image";
import routes from "@/config/routes";
import { Showcase } from "@/lib/types/showcase";
import { ColumnsPhotoAlbum } from "react-photo-album";
import "react-photo-album/columns.css";
import NewImageDialog from "./new-image-dialog";
import { useAddImage } from "@/hooks/queries/showcase";

export default function ShowcaseImageSection({
  showcase,
}: {
  showcase: Showcase;
}) {
  const { mutate } = useAddImage();
  return (
    <Card>
      <CardHeader className="border-b py-4">
        <CardTitle>Images</CardTitle>
        <div className="ml-auto">
          <NewImageDialog
            onSubmit={(input) => mutate({ id: showcase.id, input })}
          />
        </div>
      </CardHeader>
      <CardContent className="py-4">
        {showcase.images.length > 0 ? (
          <ColumnsPhotoAlbum
            photos={showcase.images.map((image, index) => ({
              src: routes.getFiles(image.fileId),
              height: image.height,
              width: image.width,
              alt: `${showcase.title} ${index}`,
            }))}
          />
        ) : (
          <div className="py-8 text-sm text-muted-foreground text-center">
            No Images
          </div>
        )}
      </CardContent>
    </Card>
  );
}
