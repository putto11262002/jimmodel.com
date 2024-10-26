import { Card } from "@/components/card";
import Image from "next/image";
import routes from "@/config/routes";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ShowcaseCoverImageUpdateDialog from "@/components/showcase/dialogs/showcase-cover-update-dialog";
import IconButton from "@/components/icon-button";
import { PlusCircle } from "lucide-react";
import Alert from "@/components/alert";
import { Showcase } from "@/lib/domains";
import { PublishValidationError } from "@/lib/usecases/showcase/types";

export default function ShowcaseCoverImageCard({
  showcase,
  publishValidation,
}: {
  showcase: Showcase;
  publishValidation?: PublishValidationError;
}) {
  return (
    <Card>
      <div className="grid gap-4">
        {publishValidation?.coverImage && (
          <Alert variant="warning">{publishValidation.coverImage}</Alert>
        )}

        <AspectRatio
          className="w-full rounded-md overflow-hidden"
          ratio={3 / 2}
        >
          <Image
            fill
            src={
              showcase.coverImageId
                ? routes.getFiles(showcase.coverImageId)
                : "/placeholder.svg"
            }
            alt={showcase.title}
          />
        </AspectRatio>
        <ShowcaseCoverImageUpdateDialog
          showcase={showcase}
          trigger={
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Upload New Cover Image
              </p>
              <IconButton
                size="sm"
                icon={<PlusCircle className="icon-sm" />}
                text="Cover Image"
              />
            </div>
          }
        />
      </div>
    </Card>
  );
}
