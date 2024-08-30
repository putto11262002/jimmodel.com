"use client";
import Container from "@/components/container";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import permissions from "@/config/permission";
import useSession from "@/hooks/use-session";

import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
const navItemsLoader = () =>
  [
    { form: "password", permissions: permissions.users.updateSelfPassword },
    { form: "roles", permissions: permissions.users.updateSelfRole },
    { form: "image", permissions: permissions.users.addSelfImage },
  ].map((item) => ({
    label: item.form,
    href: `/admin/users/self/update/${item.form}`,
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
  const session = useSession();

  if (session.status === "loading") {
    return (
      <Container className="grid gap-6">
        <Loader />;
      </Container>
    );
  }
  return (
    <Container max="md" className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => router.back()}
          className=""
          variant={"outline"}
          size={"icon"}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-2xl font-semibold">My Profile</h2>
      </div>
      <SidebarLayout items={navItemsLoader()}>{children}</SidebarLayout>
    </Container>
  );
}
