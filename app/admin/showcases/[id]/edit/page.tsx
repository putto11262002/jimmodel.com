import { Card } from "@/components/card";
import Container from "@/components/container";
import ShowcaseGeneralForm from "@/components/showcase/forms/showcase-general-form";
import permissions from "@/config/permission";
import { canPublishShowcase, getShowcaseOrThrow } from "@/loaders/showcase";
import ShowcaseSettingCard from "@/components/showcase/cards/showcase-setting-card";
import ShowcaseCoverImageCard from "@/components/showcase/cards/showcase-cover-image";
import ShowcaseModelCard from "@/components/showcase/cards/showcase-model-card";
import ShowcaseImageCard from "@/components/showcase/cards/showcase-image-card";
import ShowcaseLinkCard from "@/components/showcase/cards/showcase-link-card";
import { auth } from "@/config";
import Header, { HeaderBreadcrumb } from "@/components/shared/header";
import routes from "@/config/routes";

const breadcrumb = ({
  id,
  name,
}: {
  id: string;
  name: string;
}): HeaderBreadcrumb[] => [
  {
    label: "Admin",
    href: routes.admin.main,
  },
  { label: "Website", href: routes.admin.website.main },
  {
    label: "Showcases",
    href: routes.admin.website.showcases.main,
  },
  {
    label: name,
    href: routes.admin.website.showcases["[id]"].edit.main({ id }),
  },
];

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await auth({ permission: permissions.showcases.getShowcaseById });
  const showcase = await getShowcaseOrThrow(id);
  const publishValation = await canPublishShowcase(showcase);
  const publishValidationError = !publishValation.ok
    ? publishValation.errors
    : undefined;
  return (
    <>
      <Header
        breadcrumb={breadcrumb({ id: showcase.id, name: showcase.title })}
      />
      <Container>
        <div className="grid grid-cols-1  md:grid-cols-3 gap-4 ">
          <div className="md:col-span-2 grid gap-4 auto-rows-max">
            <Card>
              <ShowcaseGeneralForm showcase={showcase} />
            </Card>
            <ShowcaseModelCard
              showcase={showcase}
              publishValidation={publishValidationError}
            />
            <ShowcaseImageCard showcase={showcase} />
            <ShowcaseLinkCard showcase={showcase} />
          </div>
          <div className="grid gap-4 md:auto-rows-max min-w-0">
            <ShowcaseCoverImageCard
              showcase={showcase}
              publishValidation={publishValidationError}
            />
            <ShowcaseSettingCard showcase={showcase} />
          </div>
        </div>
      </Container>
    </>
  );
}
