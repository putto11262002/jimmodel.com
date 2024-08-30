"use client";
import { BreakcrumbSetter } from "@/components/breadcrumb";
import FormLink from "./_components/form-link";
import Header from "./_components/header";
import Container from "@/components/container";
import FormMenu from "./_components/form-menu";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useGetModel } from "@/hooks/queries/model";
import useSession from "@/hooks/use-session";
import permissions from "@/config/permission";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import SidebarLayout, { NavItem } from "@/components/layouts/sidebar-layout";
import { useMemo } from "react";

const navItemsLoader = ({ id }: { id: string }) =>
  [
    { label: "general", form: "general" },
    { label: "contact", form: "contact" },
    { label: "background", form: "background" },
    { label: "identification", form: "identification" },
    { label: "address", form: "address" },
    { label: "talents", form: "talents" },
    { label: "measurement", form: "measurement" },
    { label: "experiences", form: "experiences" },
    { label: "profile image", form: "profile-image" },
    { label: "images", form: "images" },
    { label: "tags", form: "tags" },
    { label: "settings", form: "settings" },
  ].map((item) => ({
    label: item.label,
    href: `/admin/models/${id}/update/${item.form}`,
  }));

export default function Layout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const session = useSession(permissions.models.getModelById);
  const router = useRouter();

  const { data, isSuccess, isPending } = useGetModel({
    modelId: id,
    enabled: session.status === "authenticated",
  });

  const navItems = useMemo(() => navItemsLoader({ id }), [id]);

  if (isPending || !isSuccess) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }
  return (
    <Container max="lg">
      <BreakcrumbSetter
        breadcrumbs={[
          { label: "Models", href: "/admin/models" },
          { label: "Edit" },
          { label: data.name },
        ]}
      />
      <div className="w-full max-w-6xl flex flex-col gap-6">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-semibold">{data.name}&apos;s Profile</h1>
        </div>
        <SidebarLayout items={navItems}>{children}</SidebarLayout>
      </div>
    </Container>
  );
}
