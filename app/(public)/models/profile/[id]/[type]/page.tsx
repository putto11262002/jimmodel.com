import GridImageGallery from "@/components/image-grid-gallery";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import routes from "@/config/routes";
import { ModelImageType } from "@/lib/types/model";
import { modelUseCase } from "@/lib/usecases";
import { upperFirst } from "lodash";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";

const types: ModelImageType[] = ["book", "polaroid", "composite"];

export default async function Page({
  params: { id, type },
}: {
  params: { id: string; type: string };
}) {
  if (!types.includes(type as any)) {
    redirect(`/models/profile/${id}/polaroid`, RedirectType.replace);
  }
  const images = await modelUseCase.getModelImages(id, {
    type: type as ModelImageType,
  });

  return (
    <div>
      <div className="flex justify-center items-center">
        <ToggleGroup
          size={"sm"}
          value={type}
          type="single"
          className="border p-1 rounded-md"
        >
          {types.map((type, index) => (
            <Link key={index} replace href={`/models/profile/${id}/${type}`}>
              <ToggleGroupItem className="w-24" value={type}>
                {upperFirst(type)}
              </ToggleGroupItem>
            </Link>
          ))}
        </ToggleGroup>
      </div>
      <div className="mt-6">
        {images.length > 0 ? (
          <GridImageGallery
            showLightBoxOnClick
            rounded={"rounded-md"}
            columns={3}
            images={images.map((image) => ({
              src: routes.getFiles(image.file.id),
              height: image.file.height!,
              width: image.file.width!,
            }))}
          />
        ) : (
          <div className="py-12 flex justify-center items-center text-muted-foreground">
            No images found
          </div>
        )}
      </div>
    </div>
  );
}
