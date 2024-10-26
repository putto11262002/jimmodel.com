import Container from "@/components/container";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import Header, { HeaderBreadcrumb } from "@/components/shared/header";
import { auth } from "@/config";
import permissions from "@/config/permission";
import routes from "@/config/routes";

const breadcrumb = ({ id }: { id: string }): HeaderBreadcrumb[] => [
  {
    label: "Admin",
    href: routes.admin.main,
  },
  {
    label: "Users",
    href: routes.admin.users.main,
  },
  {
    label: "Self",
    href: routes.admin.users["[id]"].edit.password({ id }),
  },
];

const getMenuItems = [
  {
    label: "Password",
    href: routes.admin.users["[id]"].edit.password({ id: "self" }),
    permissions: permissions.users.updateSelfPassword,
  },
  {
    label: "Roles",
    href: routes.admin.users["[id]"].edit.roles({ id: "self" }),
    permissions: permissions.users.updateSelfRole,
  },
  {
    label: "Image",
    href: routes.admin.users["[id]"].edit.image({ id: "self" }),
    permissions: permissions.users.addSelfImage,
  },
];
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <>
      <Header breadcrumb={breadcrumb({ id: session.user.id })} />
      <Container max="md" className="">
        <SidebarLayout items={getMenuItems}>{children}</SidebarLayout>
      </Container>
    </>
  );
}
