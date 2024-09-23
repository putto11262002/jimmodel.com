import { Card } from "@/components/card";
import ShowcasePublishForm from "@/components/showcase/forms/showcase-publish-form";
import ShowcaseDeleteForm from "../forms/showcase-delete-form";
import { Showcase } from "@/lib/domains";

export default async function ShowcaseSettingCard({
  showcase,
}: {
  showcase: Showcase;
}) {
  return (
    <Card>
      <div className="grid gap-4">
        <ShowcasePublishForm showcase={showcase} />
        <ShowcaseDeleteForm showcase={showcase} />
      </div>
    </Card>
  );
}
