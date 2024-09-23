import { revalidatePublicSite } from "@/actions/webiste";
import { Card } from "@/components/card";
import Container from "@/components/container";
import LabelValueItem from "@/components/key-value/key-value-item";
import AsyncButton from "@/components/shared/buttons/async-button";
import { auth } from "@/config";
import permissions from "@/config/permission";

export default async function Page() {
  await auth({ permission: permissions.website.revalidateCache });
  return (
    <Container max="md">
      <Card>
        <LabelValueItem
          label="Revalidate public website cache."
          description="This is trigger a static regeneration of the website. By default the public website is regenerated every 24 hours."
          line="break"
          value={
            <div>
              <form action={revalidatePublicSite}>
                <AsyncButton>Revalidate</AsyncButton>
              </form>
            </div>
          }
        />
      </Card>
    </Container>
  );
}
