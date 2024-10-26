import { LinkMenuItem } from "@/components/shared/types/menu";
import { SideMenu } from "./menu";
import { auth } from "@/config";
import { checkPermission } from "@/lib/auth";

export default async function SidebarLayout({
  children,
  items,
}: {
  children: React.ReactNode;
  items: LinkMenuItem[];
}) {
  const session = await auth();
  const visibleItems = items.filter(
    (item) => checkPermission(session.user, item.permissions) === "success"
  );
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="col-span-full md:col-span-1">
        <SideMenu items={visibleItems} />
      </div>
      <div className="col-span-full md:col-span-4">{children}</div>
    </div>
  );
}
