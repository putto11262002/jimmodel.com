import SidebarLayout from "@/components/layouts/sidebar-layout";
import permissions from "@/config/permission";
import { auth } from "@/config";
import { LinkMenuItem } from "@/components/shared/types/menu";
import routes from "@/config/routes";
const getMenuItems = ({ id }: { id: string }): LinkMenuItem[] => [
  {
    label: "General",
    href: routes.admin.models["[id]"].personal.main({ id }),
  },
  {
    label: "Contact",
    href: routes.admin.models["[id]"].personal.contact({ id }),
  },
  {
    label: "Background",
    href: routes.admin.models["[id]"].personal.background({ id }),
  },
  {
    label: "Identification",
    href: routes.admin.models["[id]"].personal.identification({ id }),
  },
  {
    label: "Modeling",
    href: routes.admin.models["[id]"].personal.modeling({ id }),
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
  await auth({ permission: permissions.models.getModelById });

  return <SidebarLayout items={getMenuItems({ id })}>{children}</SidebarLayout>;
}
