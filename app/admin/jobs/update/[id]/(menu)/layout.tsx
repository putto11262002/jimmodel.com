import LinkTabList from "@/components/link-tab-list";
import { Suspense } from "react";
const jobFormMenuItems = [
  { href: (id: string) => `/admin/jobs/update/${id}`, label: "General" },
  {
    href: (id: string) => `/admin/jobs/update/${id}/bookings`,
    label: "Booking",
  },
];

export default function Layout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <div className=" w-full max-w-4xl gap-4 grid">
      <div className="w-full flex items-center">
        <div className="flex items-center gap-4">
          <LinkTabList
            links={jobFormMenuItems.map(({ label, href }) => ({
              label,
              href: href(id),
            }))}
          />
        </div>
        <div className="ml-auto"></div>
      </div>

      {children}
    </div>
  );
}
