"use client";
import { UserRole } from "@/db/schemas";
import useSession from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import { upperFirst } from "lodash";
import Link from "next/link";
import { usePathname } from "next/navigation";
export type NavItem = {
  label: string;
  href: string;
  permission?: UserRole[];
};
function SidebarMenu({ items }: { items: NavItem[] }) {
  const path = usePathname();
  const session = useSession();
  if (session.status === "loading") {
    return <p>Loading...</p>;
  }
  return (
    <nav className="text-sm text-muted-foreground">
      <ul className="grid">
        {items.map(({ href, label }, index) => (
          <Link key={index} replace href={href}>
            <li
              className={cn(
                "hover:bg-gray-100 px-3 py-2 rounded",
                href == path && "font-semibold text-primary bg-gray-200/70",
              )}
            >
              {upperFirst(label)}
            </li>
          </Link>
        ))}
      </ul>
    </nav>
  );
}
export default function SidebarLayout({
  children,
  items,
}: {
  children: React.ReactNode;
  items: NavItem[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div>
        <SidebarMenu items={items} />
      </div>
      <div className="col-span-4">{children}</div>
    </div>
  );
}
