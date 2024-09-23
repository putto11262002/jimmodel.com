import { Card } from "@/components/card";
import GridImageGallery from "@/components/image-grid-gallery";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import routes from "@/config/routes";
import { MODEL_IMAGE_TYPE, MODEL_IMAGE_TYPE_LABELS } from "@/db/constants";
import { ModelImage } from "@/lib/domains";
import { getModelImages, getPublishedModels } from "@/loaders/model";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";

const types: ModelImage["type"][] = [
  MODEL_IMAGE_TYPE.BOOK,
  MODEL_IMAGE_TYPE.POLAROID,
  MODEL_IMAGE_TYPE.COMPOSITE,
];

export async function generateStaticParams() {
  const params: { id: string; type: ModelImage["type"] }[] = [];
  let hasMore = true;
  let page = 1;
  while (hasMore) {
    const models = await getPublishedModels({
      page: page,
      pageSize: 100,
    });
    models.data.forEach((model) => {
      types.forEach((type) => {
        params.push({ id: model.id, type });
      });
    });
    hasMore = models.hasNext;
    page++;
  }
  return params;
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; type: string }>;
}) {
  const { type, id } = await params;
  if (!types.includes(type as any)) {
    redirect(routes.models.profile.main(id), RedirectType.replace);
  }

  const images = await getModelImages(id, {
    type: type as ModelImage["type"],
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
            <Link
              key={index}
              replace
              href={routes.models.profile.imageType(id, type)}
            >
              <ToggleGroupItem className="w-24" value={type}>
                {MODEL_IMAGE_TYPE_LABELS[type]}
              </ToggleGroupItem>
            </Link>
          ))}
        </ToggleGroup>
      </div>
      <div className="mt-6">
        <Card>
          {images.length > 0 ? (
            <GridImageGallery
              showLightBoxOnClick
              rounded={"rounded-md"}
              columns={3}
              images={images.map((image) => ({
                src: routes.files.get(image.fileId),
                height: image.height,
                width: image.width,
              }))}
            />
          ) : (
            <div className="py-12 flex justify-center items-center text-muted-foreground">
              No images found
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
