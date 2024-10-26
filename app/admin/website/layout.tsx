import Header from "@/components/shared/header";
import permissions from "@/config/permission";
import routes from "@/config/routes";
const breadcrumbs = [
  { label: "Admin", href: routes.admin.main },
  { label: "Website", href: routes.admin.website.main },
];

const menuItems = [
  { label: "Web Assets", href: routes.admin.website.webAssets.main },
  { label: "Showcases", href: routes.admin.website.showcases.main },
  {
    label: "Settings",
    href: routes.admin.website.settings.main,
    permissions: permissions.website.revalidateCache,
  },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header breadcrumb={breadcrumbs} items={menuItems} />
      {children}
    </>
  );
}
