"use client";
import { BreakcrumbSetter, useBreadcrumbSetter } from "@/components/breadcrumb";
import Container from "@/components/container";
import Menu from "./_components/menu";
import useSession from "@/hooks/use-session";
import permissions from "@/config/permission";
import { combine } from "@/lib/utils/auth";
import { useGetJob } from "@/hooks/queries/job";
import Loader from "@/components/loader";
import JobStatusBadge from "@/components/job/job-status-badge";
const items: { label: string; href: string | ((id: string) => string) }[] = [
  { label: "General", href: (id: string) => `/admin/jobs/${id}/update` },
  { label: "Models", href: (id: string) => `/admin/jobs/${id}/models` },
  { label: "Bookings", href: (id: string) => `/admin/jobs/${id}/bookings` },
  { label: "Actions", href: (id: string) => `/admin/jobs/${id}/actions` },
];
export default function Layout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const session = useSession(
    combine(permissions.jobs.getJobById, permissions.jobs.updateJobById),
  );

  const { data, isSuccess } = useGetJob({
    jobId: id,
    enabled: session.status === "authenticated",
  });

  if (!isSuccess) {
    return (
      <Container max="md">
        <Loader />
      </Container>
    );
  }

  return (
    <Container max="md">
      <BreakcrumbSetter
        breadcrumbs={[
          { label: "Jobs", href: "/admin/jobs" },
          { label: data?.name || id },
          { label: "Edit" },
        ]}
      />
      <div className="w-full max-w-6xl flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">{data.name}</h1>
          <JobStatusBadge status={data.status} />
        </div>
        <div className="flex gap-4">
          <div className="min-w-40">
            <Menu items={items} />
          </div>
          <div className="grow min-w-0">{children}</div>
        </div>
      </div>
    </Container>
  );
}
