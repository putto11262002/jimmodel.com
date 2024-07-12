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
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:px-10">
      <div className="mx-auto w-full max-w-4xl gap-4 grid">
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
    </main>
  );
}
