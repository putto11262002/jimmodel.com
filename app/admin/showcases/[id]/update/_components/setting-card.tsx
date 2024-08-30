import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Showcase } from "@/lib/types/showcase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  usePublishShowcase,
  useUnpublishShowcase,
} from "@/hooks/queries/showcase";

export default function ShowcaseSettingForm({
  showcase,
}: {
  showcase: Showcase;
}) {
  const { mutate: publish } = usePublishShowcase();
  const { mutate: unpublish } = useUnpublishShowcase();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label>Publish</Label>
          <Switch
            className="block"
            checked={Boolean(showcase.published)}
            onCheckedChange={(published) =>
              published
                ? publish({ id: showcase.id })
                : unpublish({ id: showcase.id })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
