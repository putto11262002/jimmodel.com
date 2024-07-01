import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileUpload from "./file-upload";
import db from "@/db/client";
import { modelImageTable } from "@/db/schemas/models";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const getModelImage = async (modelId: string) => {
  const images = await db
    .select()
    .from(modelImageTable)
    .where(eq(modelImageTable.modelId, modelId));
  return images;
};

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const images = await getModelImage(id);
  return (
    <main className="px-4">
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 ">
        <div className="flex items-center">
          <div></div>
          <div className="ml-auto">
            <FileUpload modelId={id} />
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Model Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {images.map((image) => (
                <AspectRatio className="relative block" ratio={1 / 1}>
                  <Image
                    className="object-cover "
                    src={`/file/${image.fileId}`}
                    alt={"Model"}
                    fill
                  />
                </AspectRatio>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
