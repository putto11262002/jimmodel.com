import SidebarLayout from "@/components/layouts/sidebar-layout";
import permissions from "@/config/permission";
import { auth } from "@/config";
import routes from "@/config/routes";

const getMenuItems = ({ id }: { id: string }) => [
  { label: "Action", href: routes.admin.jobs["[id]"].settings.main({ id }) },
  {
    label: "Permission",
    href: routes.admin.jobs["[id]"].settings.permission({ id }),
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
  await auth({ permission: permissions.jobs.getJobById });
  const menuItems = getMenuItems({ id });

  return <SidebarLayout items={menuItems}>{children}</SidebarLayout>;
}
