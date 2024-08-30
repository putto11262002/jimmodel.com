"use client";
import Container from "@/components/container";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import Loader from "@/components/loader";
import permissions from "@/config/permission";
import { useGetUser } from "@/hooks/queries/user";
import useSession from "@/hooks/use-session";
import { combine } from "@/lib/utils/auth";
import { upperFirst } from "lodash";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

const navItemsLoader = ({ id }: { id: string }) =>
  [
    { form: "password", permissions: permissions.users.updateRoleById },
    { form: "roles", permissions: permissions.users.updateRoleById },
    { form: "image", permissions: permissions.users.addImageById },
  ].map((item) => ({
    label: item.form,
    href: `/admin/users/${id}/update/${item.form}`,
    permissions: item.permissions,
  }));
export default function Layout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const path = usePathname();
  const router = useRouter();
  const session = useSession(
    combine(
      permissions.users.updateRoleById,
      permissions.users.addImageById,
      permissions.users.updatePasswordById,
    ),
  );
  const { data, isPending } = useGetUser({
    id,
    enabled: session.status === "authenticated",
  });
  const navItems = useMemo(() => navItemsLoader({ id }), [id]);

  if (session.status === "loading" || isPending || !data) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  return (
    <Container max="md" className="grid gap-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold">
          {upperFirst(data.name)}&apos;s Profile
        </h2>
      </div>
      <SidebarLayout items={navItems}>{children}</SidebarLayout>
    </Container>
  );
}
