import Header, { HeaderBreadcrumb } from "@/components/shared/header";
import { LinkMenuItem } from "@/components/shared/types/menu";
import { auth } from "@/config";
import routes from "@/config/routes";
import { getUserOrThrow } from "@/loaders";

const breadcrumb = ({ name }: { name: string }): HeaderBreadcrumb[] => [
  { label: "Admin", href: routes.admin.main },
  {
    label: "Users",
    href: routes.admin.users.main,
  },
  {
    label: name,
    href: "#",
  },
];

const getMenuItems = ({ id }: { id: string }): LinkMenuItem[] => [
  {
    label: "Edit",
    href: routes.admin.users["[id]"].edit.password({ id }),
  },
  {
    label: "Jobs",
    href: routes.admin.users["[id]"].jobs.main({ id }),
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
  await auth();
  const user = await getUserOrThrow(id);
  return (
    <>
      <Header
        items={getMenuItems({ id })}
        breadcrumb={breadcrumb({ name: user.name })}
      />
      {children}
    </>
  );
}
