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

const items: { label?: string; id: string }[] = [
  { id: "general" },
  { id: "contact" },
  { id: "background" },
  { id: "identification" },
  { id: "address" },
  { id: "talents" },
  { id: "measurement" },
  { id: "experiences" },
  { id: "images" },
  { id: "tags" },
  { id: "settings" },
];

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

  if (isPending || !isSuccess) {
    return <Loader />;
  }
  return (
    <Container max="md">
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
        <div className="flex gap-4">
          <div className="min-w-40">
            <FormMenu items={items} />
          </div>
          <div className="grow min-w-0">{children}</div>
        </div>
      </div>
    </Container>
  );
}
