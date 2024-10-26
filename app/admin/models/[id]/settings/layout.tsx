import SidebarLayout from "@/components/layouts/sidebar-layout";
import routes from "@/config/routes";
const getMenuItems = ({ id }: { id: string }) => [
  {
    label: "Actions",
    href: routes.admin.models["[id]"].settings.main({ id }),
  },
  {
    label: "Downloads",
    href: routes.admin.models["[id]"].settings.downloads({ id }),
  },
  {
    label: "Metadata",
    href: routes.admin.models["[id]"].settings.metadata({ id }),
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
  return <SidebarLayout items={getMenuItems({ id })}>{children}</SidebarLayout>;
}
