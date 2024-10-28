import Container from "@/components/container";
import Header, { HeaderBreadcrumb } from "@/components/shared/header";
import { LinkMenuItem } from "@/components/shared/types/menu";
import routes from "@/config/routes";
import { getModelOrThrow } from "@/loaders/model";
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
  {
    label: "Models",
    href: routes.admin.models.main,
  },
  {
    label: name,
    href: routes.admin.models["[id]"].main({ id }),
  },
];

const menuItems = ({ id }: { id: string }): LinkMenuItem[] => [
  {
    label: "Personal",
    href: routes.admin.models["[id]"].personal.main({ id }),
  },
  {
    label: "Measurement",
    href: routes.admin.models["[id]"].measurement.main({ id }),
  },
  {
    label: "Images",
    href: routes.admin.models["[id]"].images.profile({ id }),
  },
  {
    label: "Blocks",
    href: routes.admin.models["[id]"].blocks.main({ id }),
  },
  { label: "Jobs", href: routes.admin.models["[id]"].jobs.main({ id }) },
  {
    label: "Settings",
    href: routes.admin.models["[id]"].settings.main({ id }),
  },
];

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const model = await getModelOrThrow(id);
  return (
    <>
      <Header
        items={menuItems({ id })}
        breadcrumb={breadcrumb({ id, name: model.name })}
      ></Header>
      <Container max="xl">{children}</Container>
    </>
  );
}
