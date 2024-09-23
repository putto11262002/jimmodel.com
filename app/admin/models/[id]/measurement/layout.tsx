import SidebarLayout from "@/components/layouts/sidebar-layout";
import permissions from "@/config/permission";
import { auth } from "@/config";
import { LinkMenuItem } from "@/components/shared/types/menu";
import routes from "@/config/routes";
const getMenuItems = ({ id }: { id: string }): LinkMenuItem[] => [
  {
    label: "Basic",
    href: routes.admin.models["[id]"].measurement.main({ id }),
  },
  {
    label: "Upper Body",
    href: routes.admin.models["[id]"].measurement.upperBody({ id }),
  },
  {
    label: "Lower Body",
    href: routes.admin.models["[id]"].measurement.lowerBody({ id }),
  },
  {
    label: "Other",
    href: routes.admin.models["[id]"].measurement.other({ id }),
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
