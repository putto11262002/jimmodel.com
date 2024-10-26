import { Card } from "@/components/card";
import ShowcaseImageGallery from "@/components/showcase/showcase-image-gallery";
import ShowcaseImageCreateDialog from "@/components/showcase/dialogs/showcase-image-create-dialog";
import { Showcase } from "@/lib/domains";

export default function ShowcaseImageCard({
  showcase,
}: {
  showcase: Showcase;
}) {
  return (
    <Card action={<ShowcaseImageCreateDialog showcase={showcase} />}>
      <ShowcaseImageGallery showcase={showcase} />
    </Card>
  );
}
