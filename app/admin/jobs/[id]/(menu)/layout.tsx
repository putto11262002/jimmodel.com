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
import { useMemo } from "react";
import SidebarLayout from "@/components/layouts/sidebar-layout";
const navItemsLoader = ({ id }: { id: string }) =>
  [
    { form: "update", label: "General" },
    { form: "models" },
    { form: "bookings" },
    { form: "actions" },
  ].map((item) => ({
    label: item.label || item.form,
    href: `/admin/jobs/${id}/${item.form}`,
  }));

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
  const navItems = useMemo(() => navItemsLoader({ id }), [id]);

  if (!isSuccess) {
    return (
      <Container max="md">
        <Loader />
      </Container>
    );
  }

  return (
    <Container max="md" className="grid gap-6">
      <BreakcrumbSetter
        breadcrumbs={[
          { label: "Jobs", href: "/admin/jobs" },
          { label: data?.name || id },
          { label: "Edit" },
        ]}
      />
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold">{data.name}</h1>
        <JobStatusBadge status={data.status} />
      </div>
      <SidebarLayout items={navItems}>{children}</SidebarLayout>
    </Container>
  );
}
