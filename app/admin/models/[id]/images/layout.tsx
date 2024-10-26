import SidebarLayout from "@/components/layouts/sidebar-layout";
import { auth } from "@/config";
import permissions from "@/config/permission";
import routes from "@/config/routes";

const getMenuItems = ({ id }: { id: string }) => [
  {
    label: "Profile",
    href: routes.admin.models["[id]"].images.profile({ id }),
  },
  {
    label: "Images",
    href: routes.admin.models["[id]"].images["[type]"]({ id, type: "all" }),
  },
];

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;
  await auth({ permission: permissions.models.getModelById });
  return <SidebarLayout items={getMenuItems({ id })}>{children}</SidebarLayout>;
}
