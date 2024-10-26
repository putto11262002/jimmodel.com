import SidebarLayout from "@/components/layouts/sidebar-layout";
import permissions from "@/config/permission";
import { auth } from "@/config";
import routes from "@/config/routes";

const getMenuItems = ({ id }: { id: string }) => [
  { label: "General", href: routes.admin.jobs["[id]"].edit.main({ id }) },
  { label: "Client", href: routes.admin.jobs["[id]"].edit.client({ id }) },
  {
    label: "Production",
    href: routes.admin.jobs["[id]"].edit.production({ id }),
  },
  { label: "Contract", href: routes.admin.jobs["[id]"].edit.contract({ id }) },
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
  const items = getMenuItems({ id });

  return <SidebarLayout items={items}>{children}</SidebarLayout>;
}
