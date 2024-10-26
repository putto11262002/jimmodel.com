import { Card } from "@/components/card";
import IconButton from "@/components/icon-button";
import { PlusCircle } from "lucide-react";
import ShowcaseLinkList from "@/components/showcase/list/showcase-link-list";
import ShowcaseLinkCreateDialog from "@/components/showcase/dialogs/showcase-link-create-dialog";
import { Showcase } from "@/lib/domains";

export default function ShowcaseLinkCard({ showcase }: { showcase: Showcase }) {
  return (
    <Card
      action={
        <ShowcaseLinkCreateDialog
          trigger={
            <IconButton
              size="sm"
              icon={<PlusCircle className="icon-sm" />}
              text="Link"
            />
          }
          showcase={showcase}
        />
      }
    >
      <ShowcaseLinkList showcase={showcase} />
    </Card>
  );
}
