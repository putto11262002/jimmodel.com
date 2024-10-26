import Container from "@/components/container";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import permissions from "@/config/permission";
import routes from "@/config/routes";

const getMenuItems = ({ id }: { id: string }) => [
  {
    label: "Password",
    href: routes.admin.users["[id]"].edit.password({ id }),
    permissions: permissions.users.updatePasswordById,
  },
  {
    label: "Roles",
    href: routes.admin.users["[id]"].edit.roles({ id }),
    permissions: permissions.users.updateRoleById,
  },
  {
    label: "Image",
    href: routes.admin.users["[id]"].edit.image({ id }),
    permissions: permissions.users.addImageById,
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
  return (
    <Container max="lg" className="">
      <SidebarLayout items={getMenuItems({ id })}>{children}</SidebarLayout>
    </Container>
  );
}
